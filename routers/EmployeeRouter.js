const express = require('express')
const authController = require('./../controllers/authController')

const router = express.Router()

router.route('/login')
    .post(authController.login)

// SUPER_ADMIN ONLY
router.use(authController.protect)
router.use(authController.restrictTo('superAdmin'))
router.route('/signup')
    .post(authController.signup)

module.exports = router