let verify = require('../authorization/verifyAuth.js');
let SceneSchema = require('../models/SceneModel');
let mongoose = require('mongoose');
let fs = require("fs");

const JPG = ["FFD8FFDB", "FFD8FFE0"];

const imgDest = "/home/keith/MYR/backend/uploads";

async function isValidRequest(sceneID, uid, res, file = false){
    //Check to make sure that a vaild file was recieved
    let fileExists = file && Object.keys(file) !== 0;
    if(file !== false && (!fileExists|| !isImage(file))){
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
        //Internal Error
        if(err){
            response = 500;
            return res.status(500).json({
                message: "Error finding the scene ID",
                error: err
            });
        }
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
    });
    return response;
}

function cleanup(path){
    fs.unlinkSync(path);
}

//TODO remove redundant code
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
        let id = req.params.id;
        let uid = req.headers['x-access-token'];
        let file = req.file;

        return isValidRequest(id, uid, res, file).then((reason) => {
            if(reason === 200){
                fs.renameSync(file.path, `${imgDest}/${id}.${file.extension}`);
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
                fs.unlink(`${imgDest}/${id}.jpg`, (err) => {
                    if(err){
                        return resp.status(404).json({
                            message: `Scene ${id} does not have an image`,
                            error: "Image not found"
                        });
                    }
                    return resp.status(204).send();
                });
            }
            return;
        });
    },

    update: function(req, resp){
        let id = req.params.id;
        let uid = req.headers['x-access-token'];

        if(!uid){
            return resp.status(400).json({
                message: "Missing user ID",
                error: "Bad Request"
            });
        }

        SceneSchema.findById(id, (err, scene) => {
            if(err){
                return res.status(500).json({
                    message: `Error finding scene ${id}`,
                    error: err
                });
            }
            if(!scene){
                return res.status(404).json({
                    message: `Scene ${id} does not exist`,
                    error: "Scene Not Found"
                });
            }
            if(scene.uid !== uid){
                return res.status(401).json({
                    message: `You do not own Scene ${id}`,
                    error: "Unauthorized"
                });
            }
            //TODO Add code to remove the image from the server
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
                return res.status(404).json({
                    message: `Scene ${id} does not exist`,
                    error: "Scene Not Found"
                });
            }
            //TODO Code to return image
        });
    }
};