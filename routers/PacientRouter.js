const express = require('express')
const pacientController = require('./../controllers/pacientController')
const authController = require('./../controllers/authController')

const router = express.Router()

// RESTRICTIONS
router.use(authController.protect)
router.use(authController.restrictTo('superAdmin', 'admin', 'assistant'))
router.route('/')
    .post(pacientController.addPacient)

module.exports = router