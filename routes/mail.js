var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
var ListenModel = require('../models/listens');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: "team.heylisten@gmail.com", 
      pass: "heylisten12!Z", 
    },
  });

router.get('/', function(req, res, next) {
    res.json({ result: false });
  });

router.post('/welcome',async function(req, res, next) {
    let info = await transporter.sendMail({
        from: '"Hey Listen 👻" <team.heylisten@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: "Bienvenue sur Hey Listen", // Subject line
        text: "Bonjour"+ req.body.firstName +"Ton compte Hey Listen à bien été crée.", // plain text body
        html: "<b>Bonjour "+ req.body.firstName +" Ton compte Hey Listen à bien été crée.</b>", // html body
      });
    res.json({ result: info });
  });

router.post('/activate',async function(req, res, next) {
  let info = await transporter.sendMail({
      from: '"Hey Listen 👻" <team.heylisten@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: "Compte Hey Listen Activé", // Subject line
      text: "Bonjour"+ req.body.firstName +"Ton compte Hey Listen à bien été activé", // plain text body
      html: "<b>Bonjour "+ req.body.firstName +"</br> Ton compte Hey Listen à bien été activé.</b>", // html body
    });
  res.json({ result: info });
});

router.post('/invite',async function(req, res, next) {
  let info = await transporter.sendMail({
      from: '"Hey Listen 👻" <team.heylisten@gmail.com>', // sender address
      to: req.body.collabEmail, // list of receivers
      subject: "Invitation Hey Listen", // Subject line
      text: "Bonjour, Ton manager t'invite à utiliser Hey Listen", // plain text body
      html: "<b>Bonjour, Ton manager t'invite à utiliser Hey Listen</b>", // html body
    });
  res.json({ result: info });
});

router.post('/relaunch',async function(req, res, next) {
  let userId = req.body.idFromFront // du reduceur
  let listen = await ListenModel.find({manager: userId,isActive:true,completedByCollabAt:null}).populate('collab').exec()
  
  for(let i=0;i<listen.length;i++){
      
      let Info = await transporter.sendMail({
          from: '"Hey Listen 👻" <team.heylisten@gmail.com>', // sender address
          to: listen[i].collab.email, // list of receivers
          subject: "Relance Hey Listen", // Subject line
          text: "Tu n'a pas rempli ton listen. C'est pas bien.", // plain text body
          html: "<b>Tu n'a pas rempli ton listen. C'est pas bien.</b>", // html body
        });
      
  }
  
  res.json("relancé");
});

module.exports = router