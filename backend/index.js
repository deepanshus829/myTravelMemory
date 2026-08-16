require('dotenv').config(); // MUST be first

const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

require('./conn') // just require, no need to store

app.use(express.json())
app.use(cors())

const tripRoutes = require('./routes/trip.routes')

app.use('/trip', tripRoutes)

app.get('/hello', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})