var mongoose = require('mongoose')

var listenSchema = mongoose.Schema({
    collab: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    manager: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    createdAt: Date,
    isActive: Boolean,
    completedByManagerAt: Date,
    completedByCollabAt: Date,
    mood: Number,
    answersCollab: Array,
    answersFeedback: Array,
    template: {type: mongoose.Schema.Types.ObjectId, ref:'templates'}

})

var ListenModel = mongoose.model('listens', listenSchema)

module.exports = ListenModel;