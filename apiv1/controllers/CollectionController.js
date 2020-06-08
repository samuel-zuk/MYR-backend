let CollectSchema = require("../models/CollectionModel");
let SceneSchema = require("../models/SceneModel");
let {verifyGoogleToken, isAdmin} = require('../authorization/verifyAuth.js');
const ObjectId = require('mongoose').Types.ObjectId;

const noToken = {
    message: "No token was received",
    error: "Bad Request"
};
const badToken = {
    message: "An invalid token was received",
    error: "Unauthorized"
};

function createFilter(params){
    let filter = {};

    if(!params){
        return filter;
    }

    if(params.collectionID){
        filter.collectionID = new RegExp(params.collectionID, 'i');
    }
    if(params.uid) {
        try{
            filter.uid = ObjectId(params.uid);
        }catch(err){}
    }
    return filter;
}

module.exports = {
    list: async function(req, resp) {
        if(!req.headers["x-access-token"]){
            return resp.status(400).json(noToken);
        }
        let uid = await verifyGoogleToken(req.headers["x-access-token"]);
        let admin = await isAdmin(req.headers["x-access-token"]);

        if(!uid && !admin){
            return resp.status(401).json(badToken);
        }
        let filter = {};
        if(req.query.filter){
            filter = createFilter(JSON.parse(`${req.query.filter}`));
        }

        let range = [0, 0];
        if(req.query.range){
            range = JSON.parse(`${req.query.range}`);
        }

        let collects;
        try{
            if(admin){
                collects = await CollectSchema.find(filter).skip(range[1]*(range[0]-1)).limit(range[1]);
                resp.set('Total-Documents', await CollectSchema.countDocuments(filter));
            }else{
                collects = await CollectSchema.find({uid: uid});
            }
        }catch(err){
            return resp.status(500).json({
                message: "Error fetching collections",
                error: err
            });
        }
        if(!collects || collects.length == 0){
            return resp.status(204).send("");
        }
        return resp.status(200).json(collects);
    },
    create: async function(req, resp) {
        if(!req.headers["x-access-token"]){
            return resp.status(400).json(noToken);
        }else if(!req.body.collectID){
            return resp.status(400).json({
                message: "Did not receive field \"collectID\"",
                error: "Bad Request"
            });
        }
        let collectID = req.body.collectID;
        let uid = await verifyGoogleToken(req.headers["x-access-token"]);

        if(!uid){
            return resp.status(401).json(badToken);
        }

        let collects = [];
        try{
            collects = await CollectSchema.find({"collectionID": collectID});
        }catch(err){
            return resp.status(500).json({
                message: "Error fetching collections",
                error: err
            });
        }

        if(collects.length > 0){
            return resp.status(409).json({
                message: `${collectID} already exists as a collection`,
                error: "Conflict"
            });
        }
        let result;
        try{
            result = await CollectSchema.create({
                collectionID: collectID,
                uid: uid,
                timestamp: Date.now()
            });
        }catch(err){
            return resp.status(500).json({
                message: `Error creating collection ${collectID}`,
                error: err
            });
        }

        return resp.status(201).json(result);
    },
    show: async function(req, resp) {
        if(!req.headers["x-access-token"]){
            return resp.status(400).json(noToken);
        }

        let collectID = req.params.collectionName;
        let uid = await verifyGoogleToken(req.headers["x-access-token"]);
        let admin = await isAdmin(req.headers["x-access-token"]);

        if(!uid && !admin){
            return resp.status(401).json(badToken);
        }

        let collect;
        try{
            collect = await CollectSchema.findOne({collectionID: collectID});
        }catch(err){
            return resp.status(500).json({
                message: "Error fetching collection",
                error: err
            });
        }

        if(!collect){
            return resp.status(404).json({
                message: `${collectID} does not exist`,
                error: "Not Found"
            });
        }
        
        if(collect.uid.toString() !== uid.toString() && !admin){
            return resp.status(401).json({
                message: `You do not own "${collectID}"`,
                error: "Unauthorized"
            });
        }
        let scenes = [];
        try{
            scenes = await SceneSchema.find({"settings.collectionID": collectID});
        }catch(err){
            return resp.status(500).json({
                message: "Error fetching collection scenes",
                error: err
            });
        }

        return resp.status(200).json(scenes);
    },
    delete: async function(req, resp){
        if(!req.headers["x-access-token"]){
            return resp.status(400).json(noToken);
        }

        let collectID = req.params.collectionName;
        let uid = await verifyGoogleToken(req.headers["x-access-token"]);

        if(!uid){
            return resp.status(401).json(noToken);
        }

        let collect = undefined;
        try{
            collect = await CollectSchema.findOne({collectionID: collectID});
        }catch(err){
            return resp.status(500).json({
                message: "Error fetching collection",
                error: err
            });
        }

        if(!collect){
            return resp.status(404).json({
                message: `${collectID} does not exist`,
                error: "Not Found"
            });
        }
        if(collect.uid.toString() !== uid.toString()){
            return resp.status(401).json({
                message: `You do not own ${collectID}`,
                error: "Unauthorized"
            });
        }
        try{
            await collect.remove();
            await SceneSchema.updateMany(
                {"settings.collectionID": collectID},
                {"$set": {
                    "settings": {"collectionID": ""}
                }
            });
        }catch(err){
            return resp.status(500).json({
                message: "Error removing collection",
                error: err
            });
        }
        return resp.status(204).send("");
    },
    getByID: async function(req, resp){
        if(!req.headers["x-access-token"]){
            return resp.status(400).json(noToken);
        }

        let id = req.params.id;
        let admin = await isAdmin(req.headers["x-access-token"]);

        if(!admin){
            return resp.status(401).json(badToken);
        }

        let collect;
        try{
            collect = await CollectSchema.findById(id);
        }catch(err){
            return resp.status(500).json({
                message: "Error fetching collection",
                error: err
            });
        }

        if(!collect){
            return resp.status(404).json({
                message: `${collectID} does not exist`,
                error: "Not Found"
            });
        }
        
        let scenes = [];
        try{
            scenes = await SceneSchema.find({"settings.collectionID": collect.collectionID});
        }catch(err){
            return resp.status(500).json({
                message: "Error fetching collection scenes",
                error: err
            });
        }
        return resp.status(200).json({ 
            scenes: scenes,
            ...(collect.toJSON())
        });
    }
};