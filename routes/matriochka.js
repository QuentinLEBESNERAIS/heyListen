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
    //CREATION DE LA BOUCLE DES ANNEES
    let years = []
    for(i=0; i<listens.length; i++){
        years.push(moment(listens[i].createdAt).format('YYYY'))
    }
    let yearsUniq = _.uniq(years)
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
        let listensByYear = await ListenModel.find({collab: userId, isActive: false, createdAt: {$gte: `${yearLoop}-01-01`, $lte: `${yearLoop}-12-31`}})
        let months = []
        for(o=0; o<listensByYear.length; o++){
            months.push(moment(listensByYear[o].createdAt).format('MM'))
            months.sort()
        }
        let monthsUniq = _.uniq(months)
        let monthsCreate = []
        for(p=0; p<monthsUniq.length; p++){
            let temp = {}
            let listensByMonths = await ListenModel.find({collab: userId, isActive: false, createdAt: {$gte: `${yearLoop}-${monthsUniq[p]}-01`, $lte: `${yearLoop}-${monthsUniq[p]}-31`}})
            temp[monthsUniq[p]]=[_.orderBy(listensByMonths, ['createdAt'],['asc'])]
            monthsCreate.push(
            temp
            )
        }
        let matriochkaDown = matriochka[i]
        matriochkaDown[_.findKey(matriochka[i])].push(...monthsCreate)
    }
    res.json ({matriochka})
});

router.post('/find-Collab', async function(req, res, next) {
    let userId = req.body.idFromFront
    let myTeam = await TeamModel.findOne({ manager: userId }).populate('collab', null, {isActive: true}).exec();
    res.json ({myTeam})
});

module.exports = router;