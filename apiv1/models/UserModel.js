let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	'name': String,
	'email': String,
	'password': String,
	'admin': Boolean,
	'user_created': Date,
	'last_login': Date,
	'subscribed': Boolean
});

module.exports = mongoose.model('User', UserSchema);
