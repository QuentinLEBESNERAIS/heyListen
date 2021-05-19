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
  let userId = req.body.idFromFront // du reduceur
  console.log("mon userId =",userId)

  let team = await TeamModel.find({manager: userId})
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

// TEST ZONE MATRIOCHKA
router.post('/test', async function(req, res, next) {
  let matriochka = []

  let userId = req.body.idFromFront
  let listens = await ListenModel.find({collab: userId, isActive: false})

  console.log("mon userId = ",userId)

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
      temp[monthsUniq[p]]=[listensByMonths]
      monthsCreate.push(
        temp
      )
    }

    //console.log(monthsCreate)

    let matriochkaDown = matriochka[i]
    matriochkaDown[_.findKey(matriochka[i])].push(...monthsCreate)

    console.log("MATRIOCHKA",_.findKey(matriochka[i])," = ", matriochka[i])
  }

  console.log("NAVIGATION TEST 2020/12 =",matriochka[1][_.findKey(matriochka[1])][2][_.findKey(matriochka[1][_.findKey(matriochka[1])][2])])
  console.log("MATRIOCHKA FINALE = ",matriochka)

  res.json ({matriochka})
});

router.get('/find-listen', async function(req,res,next){

  var isListenToComplete = await ListenModel.findOne({collab: req.query.id});
  console.log('isListenToComplete',isListenToComplete)
  if (isListenToComplete.answersCollab == null && isListenToComplete.isActive == true) {
    res.json({response: true})
  } else {
    res.json({response: false})
  }
})

module.exports = router;