let verify = require('../authorization/verifyAuth.js');
let SceneSchema = require('../models/SceneModel');
let mongoose = require('mongoose');

//TODO remove redundant code

module.exports = {
    create: function(req, res){
        let id = req.params.id;
        let uid = req.headers['x-access-token'];

        if(!uid){
            return res.status(401).json({
                message: "Missing user ID",
                error: "Unauthorized"
            });
        }

        SceneSchema.findById(id, (err, scene) =>{
            if(err){
                return res.status(500).json({
                    message: "Error finding the scene ID",
                    error: err
                });
            }
            if(!result){
                return res.status(404).json({
                    message: `Could not find scene ${id}`,
                    error: "Scene not found"
                });
            }
            if(scene.uid !== uid){
                return res.status(401).json({
                    message: `You do not own scene ${id}`,
                    error: "Unauthorized"
                });
            }

            //TODO insert code for image upload
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