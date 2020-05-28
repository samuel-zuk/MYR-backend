let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ConnectionModel = new Schema({
    sceneID: mongoose.Types.ObjectId,
    clientIDs: [ String ]
});

module.exports = mongoose.model('Connections', ConnectionModel);