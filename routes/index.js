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

router.post('/new-campaign', async function(req, res, next) {
  let token = req.body.tokenFromFront // du reduceur
  let team = req.body.teamFromFront

  // Update ancienne campagne, tous les listen dont managerId et isActive =true ==> isActive = false
  await ListenModel.updateMany(
    { manager: "token Manager", isActive: true},
    { isActive: false }
  );
  
  // Find template default

  // Création listens avec managerId from team et collabId from team
  //collab: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
  //manager: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
  for(i=0; i>team.collab.length; i++){
    var newListen = new ListenModel ({
      collab: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
      manager: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
      createdAt: new Date(),
      isActive: true,
      mood: null,
      answersCollab: [],
      answersFeedback: [],
      //template: {type: mongoose.Schema.Types.ObjectId, ref:'templates'}
    });
    var listenSaved = await newListen.save();
  }
  
  res.json ({response: 'Nouvelle campagne lancée'})
});

 router.put('/save-listen', async function(req, res, next) {
    
    await ListenModel.updateOne({collab:req.body.id, isActive : true},{
      mood:req.body.mood,
      completedByCollabAt: new Date(),
      answersCollab: [{reponse1: req.body.reponse1, reponse2: req.body.reponse2, reponse3: req.body.reponse3, reponse4: req.body.reponse4, reponse5 :req.body.reponse5}]
   })
   var saveNewListen = await ListenModel.findOne({collab:req.body.id, isActive : true})
   
  res.json ({response: saveNewListen})
 });

 router.put('/save-feedback', async function(req, res, next) {
    console.log('testfeedback',req.body.feedback1)
  await ListenModel.updateOne({collab:req.body.id, isActive : true},{
    completedByManagerAt: new Date(),
    answersFeedback: [{feedback1: req.body.feedback1, feedback2: req.body.feedback2}]
 })
 var saveNewFeedback = await ListenModel.findOne({collab:req.body.id, isActive : true})
 
res.json ({response: saveNewFeedback})
});

// INIT LISTEN DB
router.post('/initListenDB', async function(req,res,next){
  var ListenFromDB = await ListenModel.find({ token: req.body.tokenFromFront})
  res.json(ListenFromDB)
})

module.exports = router;