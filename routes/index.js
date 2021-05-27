var express = require('express');
var router = express.Router();
var TeamModel = require('../models/teams');
var ListenModel = require('../models/listens');
var moment = require('moment');
var _ = require('lodash');
const { kebabCase } = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST NEW-CAMPAIGN function-route. */
router.post('/new-campaign', async function(req, res, next) {
  let userId = req.body.idFromFront // du reduceur
  let team = await TeamModel.find({manager: userId}).populate('collab').exec()
// Update ancienne campagne, tous les listen dont managerId et isActive = true ==> isActive = false
  await ListenModel.updateMany(
    { manager: userId, isActive: true},
    { isActive: false }
  ); 
// Création listens avec managerId from team et collabId from team
  for(i=0; i<team[0].collab.length; i++){
    var newListen = new ListenModel ({
      collab: team[0].collab[i],
      manager: userId,
      createdAt: new Date(),
      isActive: true,
      mood: null,
      answersCollab: null,
      answersFeedback: null,
    });
    await newListen.save();
  }
  res.json ({response: 'Nouvelle campagne lancée'})
});

/* PUT SAVE-LISTEN function-route. */
router.put('/save-listen', async function(req, res, next) {
  await ListenModel.updateOne({collab:req.body.id, isActive : true},{
    mood:req.body.mood,
    completedByCollabAt: new Date(),
    answersCollab: [{reponse1: req.body.reponse1, reponse2: req.body.reponse2, reponse3: req.body.reponse3, reponse4: req.body.reponse4, reponse5 :req.body.reponse5}]
  })
  var saveNewListen = await ListenModel.findOne({collab:req.body.id, isActive : true})
  res.json ({response: saveNewListen})
});

/* PUT SAVE-FEEDBACK function-route. */
router.put('/save-feedback', async function(req, res, next) {
  await ListenModel.updateOne({collab:req.body.id, isActive : true},{
    completedByManagerAt: new Date(),
    answersFeedback: [{feedback1: req.body.feedback1, feedback2: req.body.feedback2}]
  })
  var saveNewFeedback = await ListenModel.findOne({collab:req.body.id, isActive : true})
  res.json ({response: saveNewFeedback})
});

/* GET FIND-LISTEN function-route. */
router.get('/find-listen', async function(req,res,next){
  var isListenToDo = await ListenModel.findOne({collab: req.query.id,isActive:true,answersCollab:null});
  var isListenToSee = await ListenModel.findOne({collab: req.query.id,isActive:true,answersCollab:{ $ne: null },answersFeedback:{ $ne: null }});
  res.json({listenToDo: isListenToDo, listenToSee:isListenToSee})
})

/* GET SEE-LISTEN function-route. */
router.get('/see-listen', async function(req,res,next){
  var listenCompleted = await ListenModel.findOne({collab: req.query.collab, isActive:true});
  var answers = listenCompleted.answersCollab[0]
  var feedbacks = listenCompleted.answersFeedback[0]
  res.json({listenCompleted, answers,feedbacks})
})

/* GET GET-STATS function-route. */
router.get('/get-stats', async function(req,res,next){
//Date il y a six mois en millisecondes => pour calcul de la date d'il y 6 mois de façon dynamique
  var dateOffset = (24*60*60*1000)*151
  var myDate = new Date()
  myDate.setTime(myDate.getTime() - dateOffset)
  myDate.setDate(1)
  var statsListen = await ListenModel.find({manager:req.query.manager, isActive:false, createdAt:{$gte:myDate}, answersCollab:{ $ne: null }});
// Création d'un tableau d'objets avec dates + mood
  var statsMood = []
  for(let i=0;i<statsListen.length;i++){
    statsMood.push({date:statsListen[i].createdAt,mood:statsListen[i].mood})
  }
// Classement par date ascendante
  statsMood.sort((a, b) => a.date - b.date)
// Fonction pour calcul de la moyenne des mood
  function numAverage(a) {
    var b = a.length,
        c = 0,i;
    for (i = 0; i < b; i++){
      c += Number(a[i]);
    }
    return c/b;
  }
  var tempJanvier = []
  var tempFévrier = []
  var tempDecembre = []
  var tempMars = []
  var tempAvril = []
  var tempMai = []
  var tempJuin = []
  var tempJuillet = []
  var tempAout =[]
  var tempSeptembre =[]
  var tempOctobre = []
  var tempNovembre =[]
// Changement du nom du mois et ajout du mood dans le tableau correspondant au mois en question
  for(let i= 0 ; i<statsMood.length;i++){
    if(statsMood[i].date.getMonth()== 00){
      statsMood[i].date = 'Janvier'
      tempJanvier.push(statsMood[i].mood)
    }
    else if(statsMood[i].date.getMonth()== 01){
      statsMood[i].date = 'Février'
      tempFévrier.push(statsMood[i].mood)
      statsMood[i].mood = numAverage(tempFévrier)
    }
    else if(statsMood[i].date.getMonth()== 02){
      statsMood[i].date = 'Mars'
      tempMars.push(statsMood[i].mood)
      statsMood[i].mood = numAverage(tempMars)
    }
    else if(statsMood[i].date.getMonth()== 03){
      statsMood[i].date = 'Avril'
      tempAvril.push(statsMood[i].mood)
      statsMood[i].mood = numAverage(tempAvril)
    }
    else if(statsMood[i].date.getMonth()== 04){
      statsMood[i].date = 'Mai'
      tempMai.push(statsMood[i].mood)
      statsMood[i].mood = numAverage(tempMai)
    }
    else if(statsMood[i].date.getMonth()== 05){
      statsMood[i].date = 'Juin'
      tempJuin.push(statsMood[i].mood)
      statsMood[i].mood = numAverage(tempJuin)
    }
    else if(statsMood[i].date.getMonth()== 06){
      statsMood[i].date = 'Juillet'
      tempJuillet.push(statsMood[i].mood)
      statsMood[i].mood = numAverage(tempJuillet)
    }
    else if(statsMood[i].date.getMonth()== 07){
      statsMood[i].date = 'Août'
      tempAout.push(statsMood[i].mood)
      statsMood[i].mood = numAverage(tempAout)
    }
    else if(statsMood[i].date.getMonth()== 08){
      statsMood[i].date = 'Septembre'
      tempSeptembre.push(statsMood[i].mood)
      statsMood[i].mood = numAverage(tempSeptembre)
    }
    else if(statsMood[i].date.getMonth()== 09){
      statsMood[i].date = 'Octobre'
      tempOctobre.push(statsMood[i].mood)
      statsMood[i].mood = numAverage(tempOctobre)
    }
    else if(statsMood[i].date.getMonth()== 10){
      statsMood[i].date = 'Novembre'
      tempNovembre.push(statsMood[i].mood)
      statsMood[i].mood = numAverage(tempNovembre)
    }
    else if(statsMood[i].date.getMonth()== 11){
      statsMood[i].date = 'Décembre'
      tempDecembre.push(statsMood[i].mood)
      statsMood[i].mood = numAverage(tempDecembre)
    }
  }
// Création d'un tableau avec un object par mois et mood moyen associé
  var monthFinal = _.uniqBy(statsMood,'date')
  for(let i=0; i<monthFinal.length;i++){
    if(monthFinal[i].date == 'Janvier'){
      monthFinal[i].mood = numAverage(tempJanvier)
    }else if(monthFinal[i].date == 'Février'){
      monthFinal[i].mood = numAverage(tempFévrier)
    }else if(monthFinal[i].date == 'Mars'){
      monthFinal[i].mood = numAverage(tempMars)
    }else if(monthFinal[i].date == 'Avril'){
      monthFinal[i].mood = numAverage(tempAvril)
    }else if(monthFinal[i].date == 'Mai'){
      monthFinal[i].mood = numAverage(tempMai)
    }else if(monthFinal[i].date == 'Juin'){
      monthFinal[i].mood = numAverage(tempJuin)
    }else if(monthFinal[i].date == 'Juillet'){
      monthFinal[i].mood = numAverage(tempJuillet)
    }else if(monthFinal[i].date == 'Août'){
      monthFinal[i].mood = numAverage(tempAout)
    }else if(monthFinal[i].date == 'Septembre'){
      monthFinal[i].mood = numAverage(tempSeptembre)
    }else if(monthFinal[i].date == 'Octobre'){
      monthFinal[i].mood = numAverage(tempOctobre)
    }else if(monthFinal[i].date == 'Novembre'){
      monthFinal[i].mood = numAverage(tempNovembre)
    }else if(monthFinal[i].date == 'Décembre'){
      monthFinal[i].mood = numAverage(tempDecembre)
    }
  }
  res.json({monthFinal})
})

module.exports = router;