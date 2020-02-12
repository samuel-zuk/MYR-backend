let SceneSchema = require('../models/SceneModel');
let fs = require("fs");

const JPG = ["FFD8FFDB", "FFD8FFE0"];

const root = `INSERT MYR BACKEND ROOT DIRECTORY HERE`;

const imgDest = `${root}/uploads`;
const notFound = `${root}/public/img/no_preview.jpg`;

const tmp = "/tmp";

/**
 * Creates an image based off of a data URL
 * 
 * @param {string} base64 The image represented as a base64 string
 * @param {string} path The path for the file to be saved
 * @returns {boolean} True on successful write to file, false otherwise
 */
function createImage(base64, path){
    let data = base64;
    try{
        data = base64.split(",")[1];
    }catch(e){
        data = base64;
    }

    try{
        fs.writeFileSync(path, data, "base64");
    }catch(err){
        console.error(err);
        return false;
    }
    return true;
}

/**
 * Processes common failures of HTTP requests
 * 
 * @param {string} sceneID The ID of the scene being used
 * @param {string} uid The ID of the user who made the request
 * @param {Express.Response} res The response variable (used for common rejections) 
 * @param {Object} file A JSON object that holds the path of the temporary file (undefined by default) 
 * @param {boolean} checkFile Initializes file checks (file is valid, valid image, etc) (false by default)
 * 
 * @returns {Promise<number>} Returns a promise that holds the HTTP status code for any failures, 200 if OK
 */
async function isValidRequest(sceneID, uid, res, file = undefined, checkFile = false){
    //Check to make sure that a vaild file was recieved
    let fileExists = (file && Object.keys(file) !== 0);
    if(checkFile && (!fileExists|| !isImage(file))){
        res.status(400).json({
            message: (!fileExists ? "No Image sent" : "Invalid Image sent"),
            error: "Bad Request"
        });
        return 400;
    }

    //User id supplied?
    if(!uid){
        res.status(401).json({
            message: "Missing user ID",
            error: "Unauthorized"
        });
        return 401;
    }
    
    //Find the scene
    let response = 0;

    await SceneSchema.findById(sceneID, (err, scene) =>{
        if(!err){     
            if(!scene){
                response = 404;
                return res.status(response).json({
                    message: `Could not find scene ${sceneID}`,
                    error: "Scene not found"
                });
            }

            if(scene.uid !== uid){
                response = 401;
                return res.status(response).json({
                    message: `You do not own scene ${sceneID}`,
                    error: "Unauthorized"
                });
            }
            response = 200;
            return;
        }
    //Catch invalid sceneID (strings that can't be cast to ObjectID)
    }).catch(err => {
        if(err.name === "CastError"){
            response = 404;
            return res.status(response).json({
                message: `Could not find scene ${sceneID}`,
                error: "Scene not found"
            });
        }

        response = 500;
        return res.status(500).json({
            message: `Error fetching scene ${sceneID}`,
            error: err
        });
    });
    return response;
}

/**
 * Cleans up in the case of an error with the request
 * @param {string} path The path of the file to be removed
 */
function cleanup(path){
    fs.unlinkSync(path);
}


/**
 * Processes the first 4 bytes of a file to determine if it is a vaild image
 * 
 * @param {Object} file A JSON object with a path specifying where the file is
 * 
 * @returns {boolean} Boolean on wheter the file is a valid image
 */
function isImage(file){
    let path = file.path;
    let data = fs.readFileSync(path);

    //Using 1st 4 bytes to determine MIME Type
    data = data.subarray(0, 4);
    let mime = data.toString("hex").toUpperCase();

    switch(mime){
        case JPG[0]:
        case JPG[1]:
            file.extension = "jpg";
            return true;
        default:
            return false;
    }
}

module.exports = {
    create: function(req, res){
        console.log(__dirname);
        let id = req.params.id;
        let uid = req.headers['x-access-token'];
        let file = {
            //Using id in combo with timestamp to prevent collisions
            path: `${tmp}/${id}-${Date.now()}.jpg`
        };

        if(req.body.data === undefined){
            return res.status(400).json({
                error: "Bad Request",
                message: "No data sent"
            });
        }
        
        if(!createImage(req.body.data, file.path)){
            return res.status(500).json({
                error: "Internal Error",
                message: "Error decoding base64 string"
            });
        }

        return isValidRequest(id, uid, res, file, true).then((reason) => {
            if(reason === 200){
                //Check to make sure a file does not already exist
                if(fs.existsSync(`${imgDest}/${id}.jpg`)){
                    res.status(409).json({
                        message: `Scene ${id} already has a preview image, use PUT to update it`,
                        error: "Conflict"
                    });
                    cleanup(file.path);
                    return;
                }
                fs.renameSync(file.path, `${imgDest}/${id}.jpg`);
                res.status(201).json({
                    message: "Created"
                });
            }else if(file){
                cleanup(file.path);
            }
            return;
        });
    },

    delete: function (req, resp){
        let id = req.params.id;
        let uid = req.headers['x-access-token'];
        
        isValidRequest(id, uid, resp).then((result) => {
            if(result === 200){
                if(!fs.existsSync(`${imgDest}/${id}.jpg`)){
                    return resp.status(404).json({
                        message: `Scene ${id} does not have an image`,
                        error: "Image not found"
                    });
                }
                fs.unlinkSync(`${imgDest}/${id}.jpg`);
                return resp.status(204).send();
            }
            return;
        });
    },

    update: function(req, resp){
        let id = req.params.id;
        let uid = req.headers['x-access-token'];
        let file = {
            path: `${tmp}/$${id}-${Date.now()}.jpg`
        };

        if(!createImage(req.body.data, file.path)){
            return res.status(500).json({
                error: "Internal Error",
                message: "Error decoding base64 string"
            });
        }

        isValidRequest(id, uid, resp, file, true).then((result) => {
            if(result === 200){
                if(!fs.existsSync(`${imgDest}/${id}.jpg`)){
                    resp.status(404).json({
                        message: `Scene ${id} does not have a preview, use POST to create one`,
                        error: "Preview not found"                        
                    });
                    cleanup(file.path);
                    return;
                }
                fs.renameSync(file.path, `${imgDest}/${id}.jpg`);
                resp.status(204).send();
            }else if(file){
                cleanup(file.path);
            }
            return;
        });
    },

    getByID: function(req, res){
        let id = req.params.id;

        SceneSchema.findById(id, (err, scene) =>{ 
            if(err){
                return res.status(500).json({
                    message: `Error finding scene ${id}`,
                    error: err
                });
            }
            if(!scene){
                return res.status(404).sendFile(notFound);
            }
            if(!fs.existsSync(`${imgDest}/${id}.jpg`)){
                return res.status(404).sendFile(notFound);
            }
            return res.status(200).sendFile(`${imgDest}/${id}.jpg`);
        });
    }
};