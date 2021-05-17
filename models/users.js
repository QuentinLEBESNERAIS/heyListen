var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    lastName: String,
    firstName: String,
    email: String,
    password: String,
    token: String,
    createdAt: Date,
    company: String,
    jobTitle: String,
    isActive: Boolean,
    type: String,
    templates: [{type: mongoose.Schema.Types.ObjectId, ref:'templates'}]
})

var UserModel = mongoose.model('users', userSchema)

module.exports = UserModel;