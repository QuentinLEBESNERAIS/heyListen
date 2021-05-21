var express = require('express');
var router = express.Router();
var TeamModel = require('../models/teams');
var ListenModel = require('../models/listens');
var TemplateModel = require('../models/templates');
var moment = require('moment');
var _ = require('lodash');
const { kebabCase } = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET TO-DASHBOARD page. */
router.get('/to-dashboard', function(req, res, next) {
  let token = req.query.token // du reduceur
  let idManager = req.query.id
    // Find by Id du manager
    // Find listen by Id du manager dont isActive == true
    //Calcul completion rate 
    // Mettre listen dans le reduceur au click sur l'oeil on récupère 
  res.json ({response: 'Nouvelle campagne lancée', listen, completionRate})
});

/* POST NEW-CAMPAIGN function-route. */
router.post('/new-campaign', async function(req, res, next) {
  let userId = req.body.idFromFront // du reduceur
  console.log("mon userId =",userId)

  let team = await TeamModel.find({manager: userId}).populate('collab').exec()
  console.log("ma Team =",team)
  console.log("mes Collabs =",team[0].collab)
  console.log("combien de Collabs ? ", team[0].collab.length)

  // Update ancienne campagne, tous les listen dont managerId et isActive =true ==> isActive = false
  await ListenModel.updateMany(
    { manager: userId, isActive: true},
    { isActive: false }
  ); 
  
  // Création listens avec managerId from team et collabId from team
  for(i=0; i<team[0].collab.length; i++){
    //if (team[i].collab.isActive) {
    var newListen = new ListenModel ({
      collab: team[0].collab[i],
      manager: userId,
      createdAt: new Date(),
      isActive: true,
      mood: null,
      answersCollab: null,
      answersFeedback: null,
    });
    var listenSaved = await newListen.save();
  //}
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
  console.log('testfeedback',req.body.feedback1)
  await ListenModel.updateOne({collab:req.body.id, isActive : true},{
    completedByManagerAt: new Date(),
    answersFeedback: [{feedback1: req.body.feedback1, feedback2: req.body.feedback2}]
  })
  var saveNewFeedback = await ListenModel.findOne({collab:req.body.id, isActive : true})
  res.json ({response: saveNewFeedback})
});

/* POST INITLISTENDB function-route. */
router.post('/initListenDB', async function(req,res,next){
  var ListenFromDB = await ListenModel.find({ token: req.body.tokenFromFront})
  res.json(ListenFromDB)
})

/* POST MATRIOCHKACOLLAB function-route. */
router.post('/matriochkaCollab', async function(req, res, next) {
  let matriochka = []
  let userId = req.body.idFromFront
  let listens = await ListenModel.find({collab: userId, isActive: false})
  console.log("mon userId = ",userId)
  //CREATION DE LA BOUCLE DE ANNEES
  let years = []
  for(i=0; i<listens.length; i++){
    years.push(moment(listens[i].createdAt).format('YYYY'))
  }
  //console.log(years)
  let yearsUniq = _.uniq(years)
  //console.log(yearsUniq)
  let yearsCreate = []
    for(i=0; i<yearsUniq.length; i++){
      let temp = {}
      temp[yearsUniq[i]]=[]
      yearsCreate.push(
        temp
      )
    }
  matriochka.push(...yearsCreate)
  //CREATION DE LA BOUCLE DES MOIS PAR ANNEE + AJOUT DES LISTENS CONCERNES
  for(i=0; i<matriochka.length; i++){
    let yearLoop = _.findKey(matriochka[i])
    //console.log(yearLoop)
    let listensByYear = await ListenModel.find({collab: userId, isActive: false, createdAt: {$gte: `${yearLoop}-01-01`, $lte: `${yearLoop}-12-31`}})
    //console.log(listensByYear)
    let months = []
    for(o=0; o<listensByYear.length; o++){
      months.push(moment(listensByYear[o].createdAt).format('MM'))
      months.sort()
    }
    let monthsUniq = _.uniq(months)
    //console.log(yearLoop," : ",monthsUniq)
    let monthsCreate = []
    for(p=0; p<monthsUniq.length; p++){
      let temp = {}
      let listensByMonths = await ListenModel.find({collab: userId, isActive: false, createdAt: {$gte: `${yearLoop}-${monthsUniq[p]}-01`, $lte: `${yearLoop}-${monthsUniq[p]}-31`}})
      //console.log("LISTENBYMONTHS TEST =", listensByMonths)

      temp[monthsUniq[p]]=[_.orderBy(listensByMonths, ['createdAt'],['asc'])]
      monthsCreate.push(
        temp
      )
    }
    //console.log(monthsCreate)
    let matriochkaDown = matriochka[i]
    matriochkaDown[_.findKey(matriochka[i])].push(...monthsCreate)
    console.log("MATRIOCHKA",_.findKey(matriochka[i])," = ", matriochka[i])
  }
  console.log("MATRIOCHKA FINALE = ",matriochka)
  res.json ({matriochka})
});

/* GET FIND-LISTEN function-route. */
router.get('/find-listen', async function(req,res,next){
  var isListenToDo = await ListenModel.findOne({collab: req.query.id,isActive:true,answersCollab:null});
  var isListenToSee = await ListenModel.findOne({collab: req.query.id,isActive:true,answersCollab:{ $ne: null },answersFeedback:{ $ne: null }});
  res.json({listenToDo: isListenToDo,listenToSee:isListenToSee})
})

router.get('/see-listen', async function(req,res,next){
  var listenCompleted = await ListenModel.findOne({collab: req.query.collab,isActive:true});
 
  var answers = listenCompleted.answersCollab[0]
  var feedbacks = listenCompleted.answersFeedback[0]
    res.json({listenCompleted, answers,feedbacks})
  
})

router.get('/get-stats', async function(req,res,next){
  var dateOffset = (24*60*60*1000)*151
  var myDate = new Date()
  myDate.setTime(myDate.getTime() - dateOffset)
  myDate.setDate(1)
  var statsListen = await ListenModel.find({manager:req.query.manager, isActive:false, createdAt:{$gte:myDate}, answersCollab:{ $ne: null }});
  var statsMood = []
  for(let i=0;i<statsListen.length;i++){
    statsMood.push({date:statsListen[i].createdAt,mood:statsListen[i].mood})
  }
  statsMood.sort((a, b) => a.date - b.date)

  for(let i= 0 ; i<statsMood.length;i++){
    if(statsMood[i].date.getMonth()== 00){
      statsMood[i].date = 'Janvier'
    }
   else if(statsMood[i].date.getMonth()== 01){
      statsMood[i].date = 'Février'
    }
    else if(statsMood[i].date.getMonth()== 02){
      statsMood[i].date = 'Mars'
    }
    else if(statsMood[i].date.getMonth()== 03){
      statsMood[i].date = 'Avril'
    }
    else if(statsMood[i].date.getMonth()== 04){
      statsMood[i].date = 'Mai'
    }
    else if(statsMood[i].date.getMonth()== 05){
      statsMood[i].date = 'Juin'
    }
    else if(statsMood[i].date.getMonth()== 06){
      statsMood[i].date = 'Juillet'
    }
    else if(statsMood[i].date.getMonth()== 07){
      statsMood[i].date = 'Août'
    }
    else if(statsMood[i].date.getMonth()== 08){
      statsMood[i].date = 'Septembre'
    }
    else if(statsMood[i].date.getMonth()== 09){
      statsMood[i].date = 'Octobre'
    }
    else if(statsMood[i].date.getMonth()== 10){
      statsMood[i].date = 'Novembre'
    }
    else if(statsMood[i].date.getMonth()== 11){
      statsMood[i].date = 'Décembre'
    }
  }
  console.log('statsMood',statsMood)
  res.json({statsMood})
})

module.exports = router;