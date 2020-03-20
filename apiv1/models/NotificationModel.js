let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
    "title": String,
    "message": {type: String, required: true},
    "link": String,
    "linkText": String,

    "color": String,
    "fontColor": String,

    "startTime": Date,
    "endTime": {type: Date, required: true},
});

module.exports = mongoose.model("Notifications", NotificationSchema);