const mongoose = require('mongoose')

const ordinationSchema = new mongoose.Schema({
    name: {
        type: String
    },
    location: {
        type: String
    },
    founded: {
        type: Date
    },
    image: {
        type: String
    }
})

const Ordination = mongoose.model('Ordination', ordinationSchema)

module.exports = Ordination