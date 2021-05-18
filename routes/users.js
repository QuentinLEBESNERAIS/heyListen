var express = require('express');
var router = express.Router();
var uid2 = require("uid2");
var bcrypt = require("bcrypt");
var UserModel = require('../models/users');
var TeamModel = require('../models/teams');
var ListenModel = require('../models/listens');

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
  console.log('searchUserByEmail', searchUserByEmail)
  if(searchUserByEmail){
    if (searchUserByEmail.password){
      res.json({response: 'login2'})
    } else {
      res.json({response: 'signUpCollab', token:'token'})
    }
  } else {
    res.json({response: 'signUpManager'})
  }
}   
);

/* Check user account (sign-in) | Body : email (sorayacantos@gmail.com), password (1234) | Response : response(), user, team */
router.post('/sign-in', async function(req, res, next) { 
  var searchUserByEmail = await UserModel.findOne({
    email: req.body.email
  })
  console.log('searchUserByEmail', searchUserByEmail)
  var result = false
  if(searchUserByEmail && bcrypt.compareSync(req.body.password, searchUserByEmail.password)){
    result = true
  }
  if(result){
    res.json({response: 'connect', user: searchUserByEmail})
  } else {
    res.json({response: 'mot de passe incorrect'})
  }
});

/*Create user account type manager (sign-up) | Body : lastName (Cantos), firstName(Soraya), password(1234), password2(1234), company(LaCapsule), jobTitle(developper) | Response : "" */
router.post('/sign-up-manager',async function(req, res, next) {
  console.log(req.body)
  let email = req.body.email
  let lastName = firstMaj(req.body.lastName)
  let firstName = firstMaj(req.body.firstName)
  let password = req.body.password
  let password2 = req.body.password2
  let company = firstMaj(req.body.company)
  let jobTitle = firstMaj(req.body.jobTitle)
  let type = 'manager'
  
  if(lastName && firstName && password && password2 && company && jobTitle && email ){
    if (password == password2){
      //Création du user Manager en BDD
      hash = bcrypt.hashSync(req.body.password,10)
      var newUser = new UserModel({
        lastName: firstMaj(req.body.lastName),
        firstName: firstMaj(req.body.firstName),
        email: email,
        password: hash,
        token: uid2(32),
        createdAt:new Date(),
        company: firstMaj(req.body.company),
        jobTitle: firstMaj(req.body.jobTitle),
        isActive: true,
        type: "manager",
      })
      var savedUser = await newUser.save()
      //Création de la team en BDD
      var newTeam = new TeamModel({
        manager: savedUser._id,
        collab: []
      })
      var savedNewTeam = await newTeam.save()

      console.log(savedUser)
      console.log(savedNewTeam)
      
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
  console.log(req.body)

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
  
  var newUser = new UserModel({
    email: req.body.collabEmail,
    token: uid2(32),
    isActive: false,
    type: "collab",
  });
  var savedUser = await newUser.save()
  console.log('savedUser', savedUser)

  var managerTeam = await TeamModel.findOne({
    manager: req.body.userId
  })
  console.log('managerTeam', managerTeam);
  var tabOfCollabs = managerTeam.collab;
  tabOfCollabs.push(savedUser._id)

  await TeamModel.updateOne({manager: req.body.userId},{
    collab: tabOfCollabs
  })
  
  res.json({response:'Collaborateur ajouté'})
});

router.post('/modification-infos', async function(req, res, next) {
  hash = bcrypt.hashSync(req.body.password,10)

  await UserModel.updateOne({token: req.body.token},{
    lastName: firstMaj(req.body.lastName),
    firstName: firstMaj(req.body.firstName),
    password: hash,
    company: firstMaj(req.body.company),
    jobTitle: firstMaj(req.body.jobTitle),
    isActive: true
  })
  var modifiedUser = await UserModel.findOne({
    token: req.body.token
  })
  console.log('modifiedUser', modifiedUser)
  
  res.json({response:'Informations modifiées', user: modifiedUser})
});


router.get('/find-collab/', async function(req,res,next){

  var team = await TeamModel.findOne({ manager:req.query.manager}).populate('collab').exec();;
 var collab=[]
 for (let i=0 ; i<team.collab.length; i++){
   collab.push(team.collab[i]._id)
 }
 var listen=[]
 var feedback=[]
 for (let i=0; i<collab.length;i++){
   var listensSearch = await ListenModel.findOne({collab:collab[i], isActive : true})
   if (listensSearch.answersCollab == null){
     listen.push(listensSearch.answersCollab = false)
   }else{
    listen.push(listensSearch.answersCollab = true)
   }
   if (listensSearch.answersFeedback == null){
    feedback.push(listensSearch.answersFeedback = false)
  }else{
    feedback.push(listensSearch.answersFeedback = true)
  }
 }
 
res.json({collabs: team.collab, collabsListen:listen, collabFeedback:feedback})
})


module.exports = router;