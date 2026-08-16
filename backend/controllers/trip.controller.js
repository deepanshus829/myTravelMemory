const tripModel = require('../models/trip.model')

async function tripAdditionController(req, res) {
    console.log("BODY:", req.body)
    try {
        let tripDetail = new tripModel.Trip({
            tripName: req.body.tripName,
            startDateOfJourney: req.body.startDateOfJourney,
            endDateOfJourney: req.body.endDateOfJourney,
            nameOfHotels: req.body.nameOfHotels,
            placesVisited: req.body.placesVisited,
            totalCost: req.body.totalCost,
            tripType: req.body.tripType,
            experience: req.body.experience,
            image: req.body.image,
            shortDescription: req.body.shortDescription,
            featured: req.body.featured
        })
        await tripDetail.save()
        res.status(200).json({
            message: "Trip added Successfully",
        })
    } catch (error) {
        console.log('ERROR', error)
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            error: error.message,
        })
    }
}

async function getTripDetailsController(req, res) {
    try {
        tripModel.Trip.find({})
            .then(doc => res.send(doc))
            .catch(err => res.status(500).json({
                message: "SOMETHING WENT WRONG WHILE FETCHING",
                error: err.message,
            }))
    } catch (error) {
        console.log('ERROR')
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            error: error.message,
        })
    }
}

async function getTripDetailsByIdController(req, res) {
    try {
        tripModel.Trip.findById(req.params.id)
            .then(doc => res.send(doc))
            .catch(err => res.status(500).json({
                message: "NOTHING IN DATABASE",
                error: err.message,
            }))
    } catch (error) {
        console.log('ERROR')
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            error: error.message,
        })
    }
}
module.exports = { tripAdditionController, getTripDetailsController, getTripDetailsByIdController }