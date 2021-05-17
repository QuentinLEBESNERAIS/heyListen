var mongoose = require('mongoose')

var teamSchema = mongoose.Schema({
    manager: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
    collab: [{type: mongoose.Schema.Types.ObjectId, ref:'users'}]
})

var TeamModel = mongoose.model('teams', teamSchema)

module.exports = TeamModel;