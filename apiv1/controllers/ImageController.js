let verify = require('../authorization/verifyAuth.js');
let SceneSchema = require('../models/SceneModel');
let mongoose = require('mongoose');
let fs = require("fs");

const JPG = ["FFD8FFDB", "FFD8FFE0"];

const imgDest = "/home/keith/MYR/backend/uploads";

async function isValidRequest(sceneID, uid, res, file = undefined, checkFile = false){
    //Check to make sure that a vaild file was recieved
    let fileExists = file && Object.keys(file) !== 0;
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
    //Catch invalid sceneID (can't be cast to ObjectID)
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

        return isValidRequest(id, uid, res, file, true).then((reason) => {
            if(reason === 200){
                if(fs.existsSync(`${imgDest}/${id}.jpg`)){
                    res.status(409).json({
                        message: `Scene ${id} already has a preview image, use PUT to update it`,
                        error: "Conflict"
                    });
                    cleanup(file.path);
                    return;
                }
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
        let file = req.file;

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
                return res.status(404).json({
                    message: `Scene ${id} does not exist`,
                    error: "Scene Not Found"
                });
            }
            if(!fs.existsSync(`${imgDest}/${id}.jpg`)){
                return res.status(404).json({
                    message: `Scene ${id} does not have a preview image`,
                    error: "Preview not found"
                });
            }
            return res.status(200).sendFile(`${imgDest}/${id}.jpg`);
        });
    }
};