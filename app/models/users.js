var mongoose = require('mongoose');

var Schema = mongoose.schema;

module.exports = mongoose.model('User', new Schema({
    name: String,
    password: String,
    admin: Boolean
}));