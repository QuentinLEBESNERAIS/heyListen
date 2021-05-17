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
  //let token = req.query.token // du reduceur
  //let team = req.query.team
  var team = [{
    manager:[],
    collab:[],
    }]
    
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
      completedByManagerAt: "",
      completedByCollabAt: "",
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



module.exports = router;
