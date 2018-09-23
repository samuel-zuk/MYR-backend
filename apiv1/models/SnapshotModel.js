let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SnapshotSchema = new Schema({
    'user': String,
    'timestamp': Date,
    'text': String,
    'error': Boolean
});

module.exports = mongoose.model('Snapshot', SnapshotSchema);
