const express = require('express');
const router = express.Router();

//---
const cityController = require('../controllers/cityController');

//---get all----
router.get('/', cityController.getAll);

//---get by id----
router.get('/:id', cityController.getOne);

//----post----
router.post('/', cityController.newCity);

//----put-----
router.put('/:id', cityController.updateCity);

//----delete----
router.delete('/:id', cityController.deleteCity);

module.exports = router;