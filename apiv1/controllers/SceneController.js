let verify = require('../authorization/verifyAuth.js');
let SceneSchema = require('../models/SceneModel');
let mongoose = require('mongoose');

function buildScene(body, settings, dest = undefined){
    if(dest === undefined){
        return new SceneSchema({
            name: body.name,
            code: body.code,
            settings: settings,
            createTime: new Date(),
            updateTime: new Date()
        });
    }
    else{
        dest.name = body.name;
        dest.code = body.code;
        dest.settings = settings;
        dest.updateTime = new Date();
        return dest;
    }
}

module.exports = {
    create: function(req, res){
        let body = req.body;
        //Ensure something was sent and a userID as well
        if(Object.keys(body).length === 0 || !req.headers['x-access-token']
            || body.settings === undefined ){
            return res.status(400).send("Bad Request");
        }

        let newScene = buildScene(body, body.settings);
        newScene.uid = req.headers['x-access-token'];
        newScene.save(function (err, result){
            if(err){
                return res.status(500).json({
                    message: 'Error creating scene',
                    error: err
                });
            }
            return res.status(201).send({_id: newScene.id});
        });
    },

    list: function(req, resp){
        if(!req.headers['x-access-token']){
            return resp.status(401).json({
                message: "No userID supplied",
                error: "Unauthorized"
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
                return resp.status(204).send({}); //No Content Found
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
    },

    update: function(req, resp){
        let id = req.params.id;
        let body = req.body;

        if(!req.headers['x-access-token']){
            return resp.status(400).json({
                message: "Missing user ID",
                error: "Bad Request"
            });
        }

        if(Object.keys(body) === 0 || body.settings === undefined){
            return resp.status(400).json({
                message: "Missing required fields",
                error: (Object.keys(body) == 0 ? "No body provided" : "No settings provided")
            });
        }
        let uid = req.headers['x-access-token'];

        SceneSchema.findOne({_id: id}, function(err, scene){
            if(err){
                return resp.status(500).json({
                    message: "Error getting scene",
                    error: err
                });
            }
            else if(!scene){
                return resp.status(404).json({
                    message: `Could not find scene "${id}"`,
                    error: "Scene not found"
                });
            }
            else if(scene.uid != uid){
                return resp.status(401).json({
                    message: `You do not own scene "${id}"`,
                    error: "Unauthorized"
                });
            }

            scene.name = body.name;
            scene.code = body.code;
            scene.settings = body.settings;
            scene.updateTime = new Date();

            scene.save(function(err, scene){
                if(err){
                    return resp.status(500).json({
                        message: "Error updating scene",
                        error: err
                    });
                }
                return resp.json(scene);//No Content
            });
        });
    },

    getByID: function(req, res){
        let id = req.params.id;

        SceneSchema.findById(id, function (err, result){
            if(result){//Err will be caught by catch function
                res.json(result);
            }
        }).catch(function (err) {
            //Might be a firebase ID
            SceneSchema.findOne({firebaseID: id}, function(err, result){
                if(err){
                    return res.status(500).json({
                        message: "Error Fetching Scenes",
                        error: err
                    });
                }
                //Not found
                if(!result){
                    return res.status(404).json({
                        message: `Could not find Scene ${id}`,
                        error: "Scene not found"
                    });
                }
                res.redirect(301, `${result.id}`);
            });
        });
    }
};