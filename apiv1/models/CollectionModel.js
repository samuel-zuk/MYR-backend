let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CollectionSchema = new Schema({
    "collectionID": String,
    "uid": mongoose.Types.ObjectId,
    "timestamp": Date
});

module.exports = mongoose.model('Collections', CollectionSchema);