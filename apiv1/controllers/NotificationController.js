let NotifSchema = require("../models/NotificationModel");
let verifyAuth = require("../authorization/verifyAuth");

const unauthorized = {
    message: "You do not have permission to do this",
    error: "Unauthorized"
};

const badRequest = {
    message: "Missing required fields",
    error: "Bad Request"
};

const notFound = {
    message: "No such notification",
    error: "Not Found"
};

module.exports = {
    fetch: async function(req, resp){
        let time = Date.now();
        let notifs;
        try{
            notifs = await NotifSchema.find({
                endTime: {$gt: time},
                startTime: {$lt: time}
            });
        }catch(err){
            return resp.status(500).json({
                message: "Error fetching notifications",
                error: err
            });
        }

        return resp.status(200).json(notifs);
    },
    create: async function(req, resp){
        let body = req.body;
        let isAdmin = await verifyAuth.isAdmin(req.headers['x-access-token']);

        if(!isAdmin){
            return resp.status(401).json(unauthorized);
        }

        if(!body || !body.endTime || !body.message){
            return resp.status(400).json(badRequest);
        }
        if(!body.startTime){
            body.startTime = Date.now();
        }
        let notif;
        try{
            notif = await NotifSchema.create(body);
        }catch(err){
            return resp.status(500).json({
                message: "Error creating Notification",
                error: err
            });
        }
        return resp.status(201).json(notif);
    },
    update: async function(req, resp){
        let body = req.body;
        let id = req.params.id;
        let isAdmin = await verifyAuth.isAdmin(requ.headers['x-access-token']);

        if(!isAdmin){
            return resp.status(401).json(unauthorized);
        }

        if(!body || !body.message || !body.endTime){
            return resp.status(400).json(badRequest);
        }

        let notif;

        try{
            notif = await NotifSchema.findById(id);
        }catch(err){
            if(err.name !== "CastError"){
                return resp.status(500).json({
                    message: "Error finding Notification",
                    error: err
                });
            }
            return resp.status(404).json(notFound);
        }

        if(!notif){
            return resp.status(404).json(notFound);
        }
        if(!body.startTime){
            body.startTime = Date.now();
        }

        try{
            await notif.updateOne(body);
        }catch(err){
            return resp.status(500).json({
                message: "Error updating notification",
                error: err
            });
        }

        return resp.sendStatus(204);
    },
    delete: async function(req, resp){
        let id  = req.params.id;
        let isAdmin = await verifyAuth.isAdmin(requ.headers['x-access-token']);

        if(!isAdmin){
            return resp.status(401).json(unauthorized);
        }

        let notif;
        try{
            notif = await NotifSchema.findById(id);
        }catch(err){
            if(err.name !== "CastError"){
                return resp.status(500).json({
                    message: "Error finding Notification",
                    error: err
                });
            }
            return resp.status(404).json(notFound);
        }

        if(!notif){
            return resp.status(404).json(notFound);
        }

        try{
            await notif.remove();
        }catch(err){
            return resp.status(500).json({
                message: "Error deleting Notification",
                error: err
            });
        }

        return resp.sendStatus(204);
    }
};