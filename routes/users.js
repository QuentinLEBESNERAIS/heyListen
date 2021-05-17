var express = require('express');
var router = express.Router();
var uid2 = require("uid2");
var bcrypt = require("bcrypt");
var UserModel = require('../models/users');
var TeamModel = require('../models/teams');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({ result: false });
});

/*
  Check Email
  Body : email (sorayacantos@gmail.com)
  Response : response(), token (1234)
*/
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

/*
  Check user account (sign-in)
  Body : email (sorayacantos@gmail.com), password (1234)
  Response : response(), user, team
*/
router.post('/sign-in', async function(req, res, next) { 
 var searchUserByEmail = await UserModel.findOne({
  email: req.body.email
})
  console.log('searchUserByEmail', searchUserByEmail)
  if(searchUserByEmail.password === req.body.password){
    res.json({response: 'connect'})
  } else {
    res.json({response: 'mot de passe incorrect'})
}
});

/*
  Create user account (sign-up)
  Body : lastName (Cantos), firstName(Soraya), password(1234), password2(1234), company(LaCapsule), jobTitle(developper) 
  Response : 
*/
router.post('/sign-up-manager',async function(req, res, next) {
  console.log(req.body)
  let email = req.body.email
  let lastName = req.body.lastName
  let firstName = req.body.firstName
  let password = req.body.password
  let password2 = req.body.password2
  let company = req.body.company
  let jobTitle = req.body.jobTitle
  let type = 'manager'
  
 if(lastName && firstName && password && password2 && company && jobTitle && email ){
  if (password == password2){
    //Création du user Manager en BDD
    hash = bcrypt.hashSync(req.body.password,10)
    var newUser = new UserModel({
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      email: email,
      password: hash,
      token: uid2(32),
      createdAt:new Date(),
      company: req.body.company,
      jobTitle: req.body.jobTitle,
      isActive: true,
      type: "manager",
  })
  var savedUser = await newUser.save()
    //Création de la team en BDD
  var newTeam = new TeamModel({
    manager: savedUser._id
  })
  var savedNewTeam = await newTeam.save()

  console.log(savedUser)
  console.log(savedNewTeam)
    
    res.json({response:"compte crée",user:savedUser,team:savedNewTeam})
  } else {
    res.json({response: 'les mots de passe ne correspondent pas'})
  } 
 } else {
  res.json({response: 'Merci de renseigner tous les champs'})
 }













 });

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
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      password: hash,
      createdAt:new Date(),
      company: req.body.company,
      jobTitle: req.body.jobTitle,
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

 router.post('/add-collab', function(req, res, next) {
  let token = req.query.token // du reduceur
  let email = req.body.email;
  let type = 'collab';
  let teamId = req.body.teamId // from reduceur
  //let token = 'uid2'
 if(lastName && firstName && email){
   if ('email valid'){
    // Création compte user Collaborateur
    // Update team
    res.json({response:'Utilisateur ajouté', team})
  } else {
    res.json ({response: 'email invalide'})
  }
 } else {
   res.json ({response: 'renseigner tous les champs'})
 }
 });

module.exports = router;
