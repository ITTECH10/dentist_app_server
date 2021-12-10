const express = require('express')
const app = express()
const cors = require('cors')
const AppError = require('./utils/appError')
const pacientRouter = require('./routers/PacientRouter')
const employeeRouter = require('./routers/EmployeeRouter')
const appointmentRouter = require('./routers/AppointmentRouter')
const cookieParser = require('cookie-parser')

const origin = process.env.NODE_ENV === 'production' ? 'https://dentist-client-app.vercel.app' : 'http://localhost:3000'

// CORS
app.use(cors({ credentials: true, origin }))
app.use(express.json())

app.use(cookieParser())

app.use('/api/v1/pacients', pacientRouter)
app.use('/api/v1/employees', employeeRouter)
app.use('/api/v1/appointments', appointmentRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`The requested url ${req.originalUrl} could not be found.`, 404))
})

module.exports = app