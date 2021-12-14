const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2;

dotenv.config({
    path: `${__dirname}/config.env`
})

const PORT = process.env.PORT || 5000
const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD)

// connect to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// connect to database
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Konekcija ka bazi podataka uspješna...'))
    .catch(err => console.log(err))

app.listen(PORT, () => {
    console.log(`Server uspješno pokrenut na portu ${PORT}...`)
})