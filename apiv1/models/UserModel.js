var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	'name': String,
	'email': String,
	'password': String,
	'admin': Boolean,
	'user_created': Date,
	'last_login': Date,
	'subscribed': Boolean
});

module.exports = mongoose.model('User', UserSchema);
