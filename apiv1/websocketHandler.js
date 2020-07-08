let Conns = require("./models/ConnectionModel");
const ObjectID = require("mongoose").Types.ObjectId;

function setupSockets(sockets) {
    sockets.on("connection", (socket) => {
        handleDisconnect(socket);
        handleSceneEvent(socket);
        handleSaveEvent(sockets.sockets, socket);
    });
    Conns.deleteMany({}).catch((err) => {
        console.error(`Error cleaning connection database: ${err}`);
    });
}

function handleDisconnect(socket) {
    socket.on("disconnect", async () => {
        try{
            await Conns.updateOne({
                clientIDs: socket.id
            }, {
                "$pull": {
                    clientIDs: socket.id
                }
            });
        }catch(err){
            console.error(`Could not remove connection ${socket.id} from the database: ${err}`);
        }
    });
}
function handleSceneEvent(socket) {
    socket.on("scene", async (sceneID) => {
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
                        socket.id
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
                    "clientIDs": socket.id
                }
            });
        }catch(err){
            socket.emit("error", err);
        }
        return;
    });
}
function handleSaveEvent(socketList, socket) {
    socket.on("save", async () => {
        let conns;
        try{
            conns = await Conns.findOne({"clientIDs": socket.id});
        }catch(err){
            socket.emit("error", err);
        }
        conns.clientIDs.forEach(id => {
            if(id !== socket.id){
                console.log(`Updating ${socket.id}`);
                socketList[id].emit("update");
            }
        });
    });
}

module.exports = setupSockets;