let { verifyGoogleToken } = require('../authorization/verifyAuth.js');
let SceneSchema = require('../models/SceneModel');

const invalid_token = {
    message: "Invalid token received",
    error: "Unauthorized"
};

function buildScene(body, settings, dest = undefined){
    if(dest === undefined){
        return new SceneSchema({
            name: body.name,
            code: body.code,
            settings: body.settings,
            createTime: new Date(),
            updateTime: new Date()
        });
    }
    else{
        dest.name = body.name;
        dest.code = body.code;
        dest.settings = body.settings;
        dest.updateTime = new Date();
        return dest;
    }
}

module.exports = {
    create: async function(req, res){
        let body = req.body;
        if(Object.keys(body).length === 0 || !req.headers['x-access-token']){ //Check if a body was supplied
            return res.status(400).send("Bad Request");
        }
        
        let uid = await verifyGoogleToken(req.headers['x-access-token']);
        if(!uid){
            return res.status(401).json(invalid_token);
        }

        let newScene = buildScene(body, body.settings);
        newScene.uid = uid;
        try{
            await newScene.save();
        }catch(err){
            return res.status(500).json({
                message: 'Error creating scene',
                error: err
            });
        }

        return res.status(201).send({_id: newScene.id});
    },
    list: async function(req, resp){
        if(!req.headers['x-access-token']){
            return resp.status(401).json({
                message: "No userID supplied",
                error: "Unauthorized"
            });
        }

        let uid = req.headers['x-access-token'];
        if(uid !== "1"){
            uid = await verifyGoogleToken(req.headers['x-access-token']);

            if(!uid){
                return resp.status(401).json(invalid_token);
            }
        }
        
        let scenes;
        try{
            scenes = await SceneSchema.find({uid: uid});
        }catch(err){
            return resp.status(500).json({
                message: "Error finding scenes",
                error: err
            });
        }

        if(scenes.length === 0){
            return resp.status(204).send({}); //No Content Found
        }

        return resp.json(scenes);
    },
    delete: async function (req, resp){
        let id = req.params.id;

        if(!req.headers['x-access-token']){
            return resp.status(400).json({
                message: "Missing user ID",
                error: "Bad Request"
            });
        }

        let uid = await verifyGoogleToken(req.headers['x-access-token']);
        if(!uid){
            return resp.status(401).json({
                message: "Invalid token recieved",
                error: "Unauthorized"
            });
        }

        //Check to make sure that the scene exists
        let scene;
        try {
            scene = await SceneSchema.findById(id);
         }catch(err){
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

        //Verify ownership of the scene before deleting it
        if(scene.uid.toString() !== uid.toString()){
            return resp.status(401).json({
                message: `You do not own scene "${id}"`,
                error: "Unauthorized"
            });
        }

        try{
            await SceneSchema.findByIdAndRemove(id);
        }catch(err){
            return resp.status(500).json({
                message: "Error deleting Scene",
                error: err
            });
        }
        return resp.send(204); //No Content
    },
    update: async function(req, resp){
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
        
        let uid = await verifyGoogleToken(req.headers['x-access-token']);
        if(!uid){
            return resp.status(401).json({
                message: "Invalid token recieved",
                error: "Unauthorized"
            });
        }

        let scene;
        try{
            scene = await SceneSchema.findById(id);
        }catch(err){
            return resp.status(500).json({
                message: "Error getting scene",
                error: err
            });
        }
        
        if(!scene){
            return resp.status(404).json({
                message: `Could not find scene "${id}"`,
                error: "Scene not found"
            });
        }
        else if(scene.uid.toString() !== uid.toString()){
            return resp.status(401).json({
                message: `You do not own scene "${id}"`,
                error: "Unauthorized"
            });
        }

        scene.name = body.name;
        scene.code = body.code;
        scene.settings = body.settings;
        scene.updateTime = new Date();

        try{
            await scene.save();
        }catch(err){
            return resp.status(500).json({
                message: "Error updating scene",
                error: err
            });
        }
        return resp.json(scene);//No Content
    },
    getByID: async function(req, res){
        let id = req.params.id;

        let scene;

        try{
            scene = await SceneSchema.findById(id);
        }catch(err) {
            //Might be a firebase ID
            try{
                scene = await SceneSchema.findOne({firebaseID: id});
            }catch(err){
                return res.status(500).json({
                    message: "Error Fetching Scenes",
                    error: err
                });
            }            
        }
        //Not found
        if(!scene){
            return res.status(404).json({
                message: `Could not find Scene ${id}`,
                error: "Scene not found"
            });
        }
        if(scene._id.toString() !== id){
            return res.redirect(301, `${scene._id}`);
        }

        return res.status(200).json(scene);
    }
};