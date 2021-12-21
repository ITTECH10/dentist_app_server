const express = require('express')
const pacientController = require('./../controllers/pacientController')
const authController = require('./../controllers/authController')
const commonController = require('./../controllers/commonController')
const appointmentRouter = require('./AppointmentRouter')
const diagnosisRouter = require('./DiagnosisRouter')

const router = express.Router()

//FIX LATER
router.use('/:pacientId/appointments', appointmentRouter)
router.use('/:pacientId/diagnosis', diagnosisRouter)

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


// IMPLEMENT LATER AND FIX
// router.use('/:pacientId/appointments', pacientController.getPacientAppointments)

module.exports = router