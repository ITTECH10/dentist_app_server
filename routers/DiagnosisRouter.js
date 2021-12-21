const express = require('express')
const authController = require('./../controllers/authController')
const commonController = require('./../controllers/commonController')
const diagnosisController = require('./../controllers/diagnosisController')

const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router.route('/')
    .post(commonController.checkForFiles, diagnosisController.createDiagnosis)
    .get(diagnosisController.getPacientDiagnosis)

router.route('/:diagnosisId')
    .get(diagnosisController.getOneDiagnosis)
    .put(commonController.checkForFiles, diagnosisController.updateDiagnosis)
    .delete(diagnosisController.deleteDiagnosis)

router.route('/all')
    .get(diagnosisController.getAllDiagnosis)

module.exports = router