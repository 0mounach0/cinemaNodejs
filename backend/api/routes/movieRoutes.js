const express = require('express');
const router = express.Router();

//---
const movieController = require('../controllers/movieController');

//---get all----
router.get('/', movieController.searchMovie);

//---get by id----
router.get('/:id', movieController.getOne);

module.exports = router;