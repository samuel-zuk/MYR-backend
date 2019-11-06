let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SceneSchema = new Schema({
    'name': String,
    'uid': String,
    'code': String,
    'settings': {
        'map': {
           'skyColor': String,
           'showFloor': Boolean,
           'floorColor': String,
           'showCoordHelper': Boolean
        },
        'camera': {
           'positon': String,
           'config': Number,
           'canFly': Boolean,
       },
       'viewOnly': Boolean,
       'collection': Schema.Types.ObjectId
    },
    'createTime': Date,
    'updateTime': Date
});

module.exports = mongoose.model('Scene', SceneSchema);