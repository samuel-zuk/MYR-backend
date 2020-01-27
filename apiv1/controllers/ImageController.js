let verify = require('../authorization/verifyAuth.js');
let SceneSchema = require('../models/SceneModel');
let mongoose = require('mongoose');
let fs = require("fs");

const PNG = "89504E47";
const JPG = ["FFD8FFDB", "FFD8FFE0"];

const imgDest = "/home/keith/MYR/backend/uploads/";

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
        case PNG:
            file.extension = "png";
            return true;
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

        if(!file || Object.keys(file) === 0){
            return res.status(400).json({
                message: "No Image sent",
                error: "Bad Request"
            });
        }

        if(!isImage(file)){
            cleanup(file.path);
            return res.status(400).json({
                message: "Invalid Image sent",
                error: "Bad Request"
            });
        }
        if(!uid){
            cleanup(file.path);
            return res.status(401).json({
                message: "Missing user ID",
                error: "Unauthorized"
            });
        }

        SceneSchema.findById(id, (err, scene) =>{
            if(err){
                cleanup(file.path);
                return res.status(500).json({
                    message: "Error finding the scene ID",
                    error: err
                });
            }
            if(!scene){
                cleanup(file.path);
                return res.status(404).json({
                    message: `Could not find scene ${id}`,
                    error: "Scene not found"
                });
            }
            if(scene.uid !== uid){
                cleanup(file.path);
                return res.status(401).json({
                    message: `You do not own scene ${id}`,
                    error: "Unauthorized"
                });
            }

            fs.renameSync(file.path, `${imgDest}/${id}.${file.extension}`);
            return res.status(201).json({
                message: "Success"
            });
        });
    },

    delete: function (req, resp){
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