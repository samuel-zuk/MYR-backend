let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GoogleAccountSchema = new Schema({
    "email": String,
    "googleId": String
});

module.exports = mongoose.model('GoogleLogin', GoogleAccountSchema);