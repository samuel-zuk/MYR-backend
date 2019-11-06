let verify = require('../authorization/verifyAuth.js');
let SceneSchema = require('../models/SceneModel');
let mongoose = require('mongoose');

module.exports = {
    create: function(req, res){
        let body = req.body;
        if(Object.keys(body).length === 0){ //Check if a body was supplied
            res.status(400).send("Bad Request");
            return;
        }
        let settings = body.settings;
        let newScene = new SceneSchema({
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
    delete: function (req, resp){
        let id = req.params.id;
        SceneSchema.findByIdAndRemove(id, function(err, scene){
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
            return resp.send(204);
        });
    }
};