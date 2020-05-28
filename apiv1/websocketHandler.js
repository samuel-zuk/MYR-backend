let Conns = require("./models/ConnectionModel");
const ObjectID = require("mongoose").Types.ObjectId;
/**
 * 
 * @param {SocketIO.Socket} socket 
 */
class SocketHandler {
    /**
     * 
     * @param {SocketIO.Socket} sockets
     */
    constructor(socket){
        this.socket = socket;
        this.id = socket.id;
        socket.on("scene", this.handleSceneEvent);
        socket.on("disconnect", this.handleDisconnect);
    }
    
    async handleDisconnect(){       
        try{
            await Conns.updateOne({
                clientIDs: this.id
            }, {
                "$pull": {
                    clientIDs: this.id
                }
            });
        }catch(err){
            console.error(`Could not remove connection ${this.id} from the database: ${err}`);
        }
    }
    
    async handleSceneEvent(sceneID){
        if(typeof(sceneID) !== "string"){
            return;
        }
    
        let connDoc;
        try{
            connDoc = await Conns.findOne({sceneID: ObjectID(sceneID)});
        }catch(err){
            socket.emit("error", err);
        }
    
        if(!connDoc){
            try{
                await Conns.create({
                    sceneID: ObjectID(sceneID),
                    clientIDs: [
                        this.id
                    ]
                });
            }catch(err){
                socket.emit("error", err);
            }
            return;
        }
    
        try{
            await connDoc.update({
                "$push": {
                    "clientIDs": this.id
                }
            });
        }catch(err){
            socket.emit("error", err);
        }
        return;
    }
}

module.exports = SocketHandler;