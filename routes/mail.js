var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");

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

  module.exports = router