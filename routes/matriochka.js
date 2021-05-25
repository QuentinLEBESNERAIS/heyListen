var express = require('express');
var router = express.Router();
var TeamModel = require('../models/teams');
var ListenModel = require('../models/listens');
var TemplateModel = require('../models/templates');
var moment = require('moment');
var _ = require('lodash');
const { kebabCase } = require('lodash');

/* POST MATRIOCHKACOLLAB function-route. */
router.post('/matriochka', async function(req, res, next) {
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

router.post('/find-Collab', async function(req, res, next) {
    let userId = req.body.idFromFront
    let myTeam = await TeamModel.findOne({ manager: userId }).populate('collab', null, {isActive: true}).exec();
    console.log("My TEAM =", myTeam)
    //console.log("My COLLAB =", myTeam.collab[0])
    res.json ({myTeam})
});

module.exports = router;