const express = require('express')
const pacientController = require('./../controllers/pacientController')
const authController = require('./../controllers/authController')
const appointmentRouter = require('./AppointmentRouter')

const router = express.Router()

router.use('/:pacientId/appointments', appointmentRouter)

// RESTRICTIONS
router.use(authController.protect)
router.use(authController.restrictTo('superAdmin', 'admin', 'assistant'))

router.route('/')
    .post(pacientController.addPacient)
    .get(pacientController.getAllPacients)

router.route('/:pacientId')
    .get(pacientController.getOnePacient)
    .put(pacientController.updatePacientBaseInfo)
    .delete(pacientController.deletePacient)

module.exports = router