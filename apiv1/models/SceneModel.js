let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const Settings = {
    'skyColor': String,
    'showFloor': Boolean,
    'floorColor': String,
    'showCoordHelper': Boolean,
    'camPositon': String,
    'camConfig': Number,
    'viewOnly': Boolean,
    'collectionID': String,
    'defaultLight': Boolean,
    'castShadow': Boolean,
    'lightIndicator': Boolean,
    'moveSpeed' : Number
};

let SceneSchema = new Schema({
    'name': String,
    'uid': mongoose.Types.ObjectId | String,
    'code': String,
    'desc': String,
    'settings': Settings,
    'createTime': Date,
    'updateTime': Date
});

module.exports = {
    "SceneSchema": mongoose.model('Scene', SceneSchema),
    "Settings": Settings
}
