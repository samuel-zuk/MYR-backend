let verify = require('../authorization/verifyAuth.js');
let SceneSchema = require('../models/SceneModel');
let mongoose = require('mongoose');

function buildScene(body, settings){
    return new SceneSchema({
        name: body.name,
        uid: body.uid,
        code: body.code,
        settings:{
            map: {
                skyColor: settings.map.skyColor,
                showFloor: settings.map.showFloor,
                floorColor: settings.map.floorColor,
                showCoordHelper: settings.map.showCoordHelper
            },
            camera: {
                position: settings.camera.position,
                config: (settings.camera.config ? settings.camera.config : 0),
                canFly: settings.camera.canFly
            },
            viewOnly: settings.viewOnly,
            collection: settings.collection
        },
        createTime: new Date(),
        updateTime: new Date()
    });
}

module.exports = {
    create: function(req, res){
        let body = req.body;
        if(Object.keys(body).length === 0 && body.uid === ""){ //Check if a body was supplied
            return res.status(400).send("Bad Request");
        }
        let newScene = buildScene(body, body.settings);
        newScene.save(function (err, result){
            if(err){
                return res.status(500).json({
                    message: 'Error creating scene',
                    error: err
                });
            }
            return res.status(201).send({id: newScene.id});
        });
    },
    list: function(req, resp){
        if(!req.headers['x-access-token']){
            return resp.status(400).json({
                message: "Missing user ID",
                error: "Bad Request"
            });
        }
        let uid = req.headers['x-access-token'];
        SceneSchema.find({uid: uid}, function(err, scenes){
            if(err){
                return resp.status(500).json({
                    message: "Error finding scenes",
                    error: err
                });
            }
            if(scenes.length == 0){
                return resp.status(204); //No Content Found
            }
            return resp.json(scenes);
        });
    },
    delete: function (req, resp){
        let id = req.params.id;

        if(!req.headers['x-access-token']){
            return resp.status(400).json({
                message: "Missing user ID",
                error: "Bad Request"
            });
        }

        let uid = req.headers['x-access-token'];

        //Check to make sure that the scene exists and is owned by the uid before removing it
        SceneSchema.findById(id, function(err, scene){
            if(err){
                return resp.status(500).json({
                    message: "Error deleting Scene",
                    error: err
                });
            }
            if(!scene){
                return resp.status(404).json({
                    message: `Could not find scene id "${id}"`,
                    error: "Scene Not Found"
                });
            }
            if(scene.uid != uid){
                return resp.status(401).json({
                    message: `You do not own scene "${id}"`,
                    error: "Unauthorized"
                });
            }
            else{
                SceneSchema.findByIdAndRemove(id, function(err, scene){
                    if(err){
                        return resp.status(500).json({
                            message: "Error deleting Scene",
                            error: err
                        });
                    }
                    return resp.send(204); //No Content
                });
            }
        });
    }
};