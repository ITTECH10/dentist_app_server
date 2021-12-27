const express = require('express')
const app = express()
const cors = require('cors')
const AppError = require('./utils/appError')
const pacientRouter = require('./routers/PacientRouter')
const employeeRouter = require('./routers/EmployeeRouter')
const appointmentRouter = require('./routers/AppointmentRouter')
const diagnosisRouter = require('./routers/DiagnosisRouter')
const ordinationRouter = require('./routers/OrdinationRouter')
const cookieParser = require('cookie-parser')
const os = require('os')
const fileupload = require('express-fileupload')

const origin = process.env.NODE_ENV === 'production' ? 'https://dentist-n2p5j4fk5-ittech10.vercel.app' : 'http://localhost:3000'

// CORS
app.use(cors({ credentials: true, origin }))
app.use(cookieParser())

app.use(express.json())
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: os.tmpdir()
}));

app.use('/api/v1/pacients', pacientRouter)
app.use('/api/v1/employees', employeeRouter)
app.use('/api/v1/appointments', appointmentRouter)
app.use('/api/v1/diagnosis', diagnosisRouter)
app.use('/api/v1/ordinations', ordinationRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`The requested url ${req.originalUrl} could not be found.`, 404))
})

module.exports = app