const express = require('express');
const router = express.Router();

//---
const cinemaController = require('../controllers/cinemaController');

//---get all----
router.get('/', cinemaController.getAll);

//---get by id----
router.get('/:id', cinemaController.getOne);

//----post----
router.post('/', cinemaController.newCinema);

//----patch-----
router.patch('/:id', cinemaController.updateCinema);

//----delete----
router.delete('/:id', cinemaController.deleteCinema);

module.exports = router;