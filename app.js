const express = require('express')
const app = express()
const cors = require('cors')
const AppError = require('./utils/appError')

// CORS
app.use(cors())

app.all('*', (req, res, next) => {
    next(new AppError(`The requested url ${req.originalUrl} could not be found.`, 404))
})

module.exports = app