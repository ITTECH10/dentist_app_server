const express = require('express')
const authController = require('./../controllers/authController')
const employeeController = require('./../controllers/employeeController')
const commonController = require('./../controllers/commonController')

const router = express.Router()

router.route('/login')
    .post(authController.login)
router.route('/logout')
    .post(authController.logout)

router.use(authController.protect)
router.route('/me')
    .get(employeeController.getLogedInEmployees)

// ROLE PERMISSIONS FOR BELLOW ROUTES
router.use(authController.restrictTo('director', 'deputy'))

router.route('/signup')
    .post(commonController.checkForFiles, authController.signup)

router.route('/')
    .get(employeeController.getAllEmployees)

router.route('/:employeeId')
    .get(employeeController.getOneEmployee)
    .delete(employeeController.deleteEmployee)
    .put(employeeController.updateEmployeeBaseInfo)


module.exports = router