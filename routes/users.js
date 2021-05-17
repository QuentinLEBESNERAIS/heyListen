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
router.post('/check-email', function(req, res, next) {
  let validEmail = req.body.email
  if(!validEmail){
    res.json({ response: 'EmailInvalide'});
  }
if(validEmail){
 let emailFromBdd; // On cherche l'utilisateur en base de données à partir de son email
  if(emailFromBdd){
    let password; // Vérifier en bdd si cet email a un mot de passe
    if (password){
      res.json({response: 'login2', token: 'token'})
    } else {
      res.json({response: 'signUpCollab', token:'token'})
    }
  } else {
    res.json({response: 'signUpManager'})
  }
}   
});

/*
  Check user account (sign-in)
  Body : email (sorayacantos@gmail.com), password (1234)
  Response : response(), user, team
*/
router.post('/sign-in', function(req, res, next) {
  let token = req.query.token // du reduceur

  if (token) {
 let password = req.body.password;
 let email = req.body.email;
 if (!password){
  res.json({response: 'renseigner mot de passe'})
 } else {
  let user; //on cherche le user dans la bdd
  let bddPassword; // Regarder si user a un MdP
  if(bddPassword === req.body.password){
    res.json({response: 'connect', user , team})
  } else {
    res.json({response: 'mot de passe incorrect'})











  }
 }
}
});

/*
  Create user account (sign-up)
  Body : lastName (Cantos), firstName(Soraya), password(1234), password2(1234), company(LaCapsule), jobTitle(developper) 
  Response : 
*/
router.post('/sign-up-manager', function(req, res, next) {
  console.log(req.body)
  let lastName = req.body.lastName
  let firstName = req.body.firstName
  let password = req.body.password
  let password2 = req.body.password2
  let company = req.body.company
  let jobTitle = req.body.jobTitle
  let type = 'manager'
  // let token = iud2
 if(lastName && firstName && password && password2 && company && jobTitle){
  if (password == password2){
    let user; // Créer le user manager
    let team; // Créer la team
    res.json({response: 'created account', user, team})
  } else {
    res.json({response: 'les mots de passe ne correspondent pas'})
  } 
 } else {
  res.json({response: 'renseigner tous les champs'})
 }












 
 });

 router.post('/sign-up-collab', function(req, res, next) {
  let token = req.query.token // du reduceur
  let lastName = req.body.lastName;
  let firstName = req.body.firstName;
  let password = req.body.password;
  let password2 = req.body.password2;
  let company = req.body.company;
  let jobTitle = req.body.jobTitle;
  let type = 'collab'
  // let token = iud2
 if(lastName && firstName && password && password2 && company && jobTitle){
  if (password == password2){
    // Updater le compte user Collaborateur
    res.json({response: 'created account', user})
  } else {
    res.json({response: 'les mots de passe ne correspondent pas'})
  } 
 } else {
  res.json({response: 'renseigner tous les champs'})
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
