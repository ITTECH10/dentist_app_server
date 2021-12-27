const express = require('express');
const commonController = require('./../controllers/commonController')
const ordinationsController = require('./../controllers/ordinationsController')
const authController = require('./../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router.route('/')
    .get(ordinationsController.getAllOrdinations)
    .post(commonController.checkForFiles, ordinationsController.createOrdination)

router.route('/:ordinationId')
    .get(ordinationsController.getOneOrdination)
    .put(commonController.checkForFiles, ordinationsController.updateOrdination)
    .delete(ordinationsController.deleteOrdination)

module.exports = router