const express = require('express')
const pacientController = require('./../controllers/pacientController')
const authController = require('./../controllers/authController')
const commonController = require('./../controllers/commonController')
const appointmentRouter = require('./AppointmentRouter')

const router = express.Router()

router.use('/:pacientId/appointments', appointmentRouter)

// RESTRICTIONS
router.use(authController.protect)
router.use(authController.restrictTo('director', 'deputy', 'assistant'))

router.route('/')
    .post(commonController.checkForFiles, pacientController.addPacient)
    .get(pacientController.getAllPacients)

router.route('/:pacientId')
    .get(pacientController.getOnePacient)
    .put(commonController.checkForFiles, pacientController.updatePacientBaseInfo)
    .delete(pacientController.deletePacient)

module.exports = router