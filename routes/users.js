var express = require('express');
var router = express.Router();
var uid2 = require("uid2");
var bcrypt = require("bcrypt");
var UserModel = require('../models/users');
var TeamModel = require('../models/teams');
var ListenModel = require('../models/listens');
const { remove } = require('lodash');

/*Fonction pour passer la premiere lettre en majuscule*/
function firstMaj(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({ result: false });
});

/* Check Email | Body : email (sorayacantos@gmail.com) | Response : response(), token (1234) */
router.post('/check-email', async function(req, res, next) {
  var searchUserByEmail = await UserModel.findOne({
    email: req.body.email
  })
 
  if(searchUserByEmail){
    if (searchUserByEmail.password){
      res.json({response: 'login2'})
    } else {
      res.json({response: 'signUpCollab'})
    }
  } else {
    res.json({response: 'signUpManager'})
  }
});

/* Check user account (sign-in) | Body : email (sorayacantos@gmail.com), password (1234) | Response : response(), user, team */
router.post('/sign-in', async function(req, res, next) { 
  let searchUserByEmail = await UserModel.findOne({
    email: req.body.email
  })

  var result = false
  if(searchUserByEmail && bcrypt.compareSync(req.body.password, searchUserByEmail.password)){
    result = true
  }

  searchUserByEmail.password = undefined;

  if(result){
    res.json({response: 'connect', user: searchUserByEmail})
  } else {
    res.json({response: 'mot de passe incorrect'})
  }
});

/*Create user account type manager (sign-up) | Body : lastName (Cantos), firstName(Soraya), password(1234), password2(1234), company(LaCapsule), jobTitle(developper) | Response : "" */
router.post('/sign-up-manager',async function(req, res, next) {
  
  let email = req.body.email
  let lastName = firstMaj(req.body.lastName)
  let firstName = firstMaj(req.body.firstName)
  let password = req.body.password
  let password2 = req.body.password2
  let company = firstMaj(req.body.company)
  let jobTitle = firstMaj(req.body.jobTitle)

  if(lastName && firstName && password && password2 && company && jobTitle && email ){
    if (password == password2){
      //Création du user Manager en BDD
      hash = bcrypt.hashSync(req.body.password,10)
      var newUser = new UserModel({
        lastName: firstMaj(req.body.lastName),
        firstName: firstMaj(req.body.firstName),
        email: req.body.email,
        password: hash,
        token: uid2(32),
        createdAt:new Date(),
        company: firstMaj(req.body.company),
        jobTitle: firstMaj(req.body.jobTitle),
        isActive: true,
        type: "manager",
      })
      var savedUser = await newUser.save()
      savedUser.password = undefined

      //Création de la team en BDD
      var newTeam = new TeamModel({
        manager: savedUser._id,
        collab: []
      })
      var savedNewTeam = await newTeam.save()

      res.json({response:"compte crée", user:savedUser, team:savedNewTeam})
    } else {
      res.json({response: 'les mots de passe ne correspondent pas'})
    } 
  } else {
    res.json({response: 'Merci de renseigner tous les champs'})
  }
});

/*Create user account type collab préinscrit (sign-up) | Body : lastName (Cantos), firstName(Soraya), password(1234), password2(1234), company(LaCapsule), jobTitle(developper) | Response : "" */
router.post('/sign-up-collab',async function(req, res, next) {
  
  let email = req.body.email
  let lastName = req.body.lastName
  let firstName = req.body.firstName
  let password = req.body.password
  let password2 = req.body.password2
  let company = req.body.company
  let jobTitle = req.body.jobTitle

  if(lastName && firstName && password && password2 && company && jobTitle && email ){
    if (password == password2){
      //Création du user Collab en BDD
      hash = bcrypt.hashSync(req.body.password,10)
      await UserModel.updateOne({email:req.body.email},{
        lastName: firstMaj(req.body.lastName),
        firstName: firstMaj(req.body.firstName),
        password: hash,
        createdAt:new Date(),
        company: firstMaj(req.body.company),
        jobTitle: firstMaj(req.body.jobTitle),
        isActive:true
      })
      var newUser = await UserModel.findOne({email:req.body.email})
      //pour ne pas renvoyer le mot de passe au front :
      newUser.password = undefined

      res.json({response:"compte crée",user:newUser})
    } else {
      res.json({response: 'les mots de passe ne correspondent pas'})
    } 
  } else {
    res.json({response: 'Merci de renseigner tous les champs'})
  }
});

/*Ajout d'un collab par le manager */
router.post('/add-collab', async function(req, res, next) {
  var userExist = await UserModel.findOne({ email:req.body.collabEmail})

  // Si le collab n'existe pas on crée le user
  if(!userExist)
  {var newUser = new UserModel({
    email: req.body.collabEmail,
    token: uid2(32),
    isActive: false,
    type: "collab",
  });
  userExist = await newUser.save()
  }
  
  // Si le user existe on passe ses listen à isActive = false
  if(userExist) {
    await ListenModel.updateOne(
      { collab: userExist._id, isActive: true},
      { isActive: false }
    ); 
  
  // On élimine le collab de son ancienne team
  var previousTeam = await TeamModel.findOne({collab: userExist._id})

  if (previousTeam) {
    var newTeam = previousTeam.collab.filter(element => element != `${userExist._id}`);
    await TeamModel.updateOne({collab: userExist._id},{collab: newTeam})
  }
  }

  // On crée un listen pour ce collab
  var newListen = new ListenModel ({
    collab: userExist._id,
    manager: req.body.userId,
    createdAt: new Date(),
    isActive: true,
    mood: null,
    answersCollab: null,
    answersFeedback: null,
  });
  await newListen.save();


  // Ajout du collab dans la team du manager connecté
   var managerTeam = await TeamModel.findOne({
    manager: req.body.userId
  })
 
  var tabOfCollabs = managerTeam.collab;
  tabOfCollabs.push(userExist._id)
  await TeamModel.updateOne({manager: req.body.userId},{
    collab: tabOfCollabs
  })
 
  // Populate pour accéder aux informations des collaborateurs pour ne filtrer que les collabs actifs
  var newManagerTeam = await TeamModel.findOne({
    manager: req.body.userId
  }).populate('collab').exec()
  newManagerTeam = newManagerTeam.collab.filter( e => e.isActive == true)

  // Reconstitution d'un tableau avec les ids, les prénoms et les noms des collabs de la team auquel on associe la réponse du collab et le feedback du manager des listen actifs
  var collab=[]
  
  for (let i=0 ; i<newManagerTeam.length; i++){
    collab.push({_id:newManagerTeam[i]._id, lastName:newManagerTeam[i].lastName,firstName:newManagerTeam[i].firstName})
  }

  for (let i=0; i<collab.length;i++){
    var listensSearch  = await ListenModel.findOne({collab:collab[i]._id, isActive : true})
    if(listensSearch){
      if (listensSearch.answersCollab != null){
       
        collab[i].listen= true
      }else{
        
        collab[i].listen= false
      }
      if (listensSearch.answersFeedback != null){
        
        collab[i].feedback = true
      }else{
        collab[i].feedback = false
      }
    }
  }
  
  res.json({response:'Collaborateur ajouté', newManagerTeam: collab})
});

/*Modification des informations personnelles */
router.post('/modification-infos', async function(req, res, next) {
  hash = bcrypt.hashSync(req.body.password,10)

  // Modification après soumission du formulaire 
  await UserModel.updateOne({token: req.body.token},{
    lastName: firstMaj(req.body.lastName),
    firstName: firstMaj(req.body.firstName),
    password: hash,
    company: firstMaj(req.body.company),
    jobTitle: firstMaj(req.body.jobTitle),
    isActive: true
  })

  // Recherche pour renvoie au front
  var modifiedUser = await UserModel.findOne({
    token: req.body.token
  })
  modifiedUser.password = undefined;
  
  res.json({response:'Informations modifiées', user: modifiedUser})
});

// Pour constituer la liste affichée dans le dashboard
router.get('/find-collab', async function(req,res,next){
  //Recherche de la team du manager connecté avec infos des collabs
  var team = await TeamModel.findOne({ manager:req.query.manager}).populate('collab').exec();
  var filteredTeam = team.collab.filter( e => e.isActive == true)

  // Reconstitution d'un tableau avec les ids, les prénoms et les noms des collabs de la team auquel on associe la réponse du collab et le feedback du manager des listen actifs
  var collab=[]
  
  for (let i=0 ; i<filteredTeam.length; i++){
    collab.push({_id:filteredTeam[i]._id, lastName:filteredTeam[i].lastName,firstName:filteredTeam[i].firstName})
  }

  for (let i=0; i<collab.length;i++){
    var listensSearch  = await ListenModel.findOne({collab:collab[i]._id, isActive : true})
    if(listensSearch){
      if (listensSearch.answersCollab != null){
       
        collab[i].listen= true
      }else{
        
        collab[i].listen= false
      }
      if (listensSearch.answersFeedback != null){
        
        collab[i].feedback = true
      }else{
        collab[i].feedback = false
      }
    }
  }
  
res.json({collabs:collab})
})

/*Suppression d'un collaborateur de la team */
router.put('/delete-collab', async function(req,res,next){

// Recherche de la team du manager connecté
  var managerTeam = await TeamModel.findOne({
    manager: req.body.idManager
  })

// Suppression du collaborateur sélectionné
  var filteredTeam = managerTeam.collab.filter(element => element != req.body.idCollab);

  filteredManagerTeam = await TeamModel.updateOne({manager: req.body.idManager}, {collab: filteredTeam})

// Recherche de la team du manager + infos collab pour renvoie au front
  var newManagerTeam = await TeamModel.findOne({
    manager: req.body.idManager
  }).populate('collab').exec()
  newManagerTeam = newManagerTeam.collab.filter( e => e.isActive == true)

// On passe ses listens actifs avec ce manager à false
  await ListenModel.updateOne({collab: req.body.idCollab}, {isActive: false})

  // Reconstitution d'un tableau avec les ids, les prénoms et les noms des collabs de la team auquel on associe la réponse du collab et le feedback du manager des listen actifs
  var collab=[]
  
  for (let i=0 ; i<newManagerTeam.length; i++){
    collab.push({_id:newManagerTeam[i]._id, lastName:newManagerTeam[i].lastName,firstName:filteredTeam[i].firstName})
  }

  for (let i=0; i<collab.length;i++){
    var listensSearch  = await ListenModel.findOne({collab:collab[i]._id, isActive : true})
    if(listensSearch){
      if (listensSearch.answersCollab != null){
       
        collab[i].listen= true
      }else{
        
        collab[i].listen= false
      }
      if (listensSearch.answersFeedback != null){
        
        collab[i].feedback = true
      }else{
        collab[i].feedback = false
      }
    }
  }

res.json({newManagerTeam : collab})
})

module.exports = router;