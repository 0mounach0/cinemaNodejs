const express = require('express');
const router = express.Router();

//---
const cinemaController = require('../controllers/cinemaController');
const sessionController = require('../controllers/sessionController');

//---get all----
router.get('/', cinemaController.getAll);

//---get by id----
router.get('/:id', cinemaController.getOne);
router.get('/:id/theaters', cinemaController.getCinemaTheaters);
router.get('/:id/sessions', sessionController.getCinemaSessions);

//----post----
router.post('/', cinemaController.newCinema);

//----put-----
router.put('/:id', cinemaController.updateCinema);

//----delete----
router.delete('/:id', cinemaController.deleteCinema);

module.exports = router;