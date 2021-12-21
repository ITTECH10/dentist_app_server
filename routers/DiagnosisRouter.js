const express = require('express')
const authController = require('./../controllers/authController')
const commonController = require('./../controllers/commonController')
const diagnosisController = require('./../controllers/diagnosisController')

const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router.route('/')
    .post(commonController.checkForFiles, diagnosisController.createDiagnosis)
    .get(diagnosisController.getAllDiagnosis)

module.exports = router