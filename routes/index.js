var express = require('express');
var router = express.Router();
var TeamModel = require('../models/teams');
var ListenModel = require('../models/listens');
var TemplateModel = require('../models/templates');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/to-dashboard', function(req, res, next) {
  let token = req.query.token // du reduceur
  let idManager = req.query.id
  // Find by Id du manager
  // Find listen by Id du manager dont isActive == true
  //Calcul completion rate 
  // Mettre listen dans le reduceur au click sur l'oeil on récupère 
  res.json ({response: 'Nouvelle campagne lancée', listen, completionRate})
 });

router.get('/new-campaign', function(req, res, next) {
  let token = req.query.token // du reduceur
  let team = req.query.team

  // Update ancienne campagne, tous les listen dont managerId et isActive =true ==> isActive = false
  await ListenModel.update(
    { manager: "token Manager", isActive: true},
    { isActive: false }
  );
  
  // Find template default
  // Création listens avec managerId from team et collabId from team

  for(i=0; i>team.collab.length; i++){
    var newListen = new ListenModel ({
      collab: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
      manager: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
      createdAt: Date,
      isActive: Boolean,
      completedByManagerAt: Date,
      completedByCollabAt: Date,
      mood: Number,
      answersCollab: Array,
      answersFeedback: Array,
      //template: {type: mongoose.Schema.Types.ObjectId, ref:'templates'}
    });
    var listenSaved = await newListen.save();
  }
  
  
  res.json ({response: 'Nouvelle campagne lancée'})
});



module.exports = router;
