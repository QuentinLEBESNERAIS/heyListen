var mongoose = require('mongoose')

var templateSchema = mongoose.Schema({
    name: String,
    questions: Array,
    feedbacks: Array,
})

var TemplateModel = mongoose.model('templates', templateSchema)

module.exports = TemplateModel;