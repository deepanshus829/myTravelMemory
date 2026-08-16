const mongoose = require('mongoose')

const URL = process.env.MONGO_URI

console.log("Mongo URI:", URL) // debug

mongoose.connect(URL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'DB ERROR: '))
db.once('open', () => console.log("DB Connected ✅"))

module.exports = mongoose