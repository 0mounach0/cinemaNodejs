const express = require('express');
const router = express.Router();

//---
const theaterController = require('../controllers/theaterController');

//---get all----
router.get('/', theaterController.getAll);

//---get by id----
router.get('/:id', theaterController.getOne);

//----post----
router.post('/', theaterController.newTheater);

//----put-----
router.put('/:id', theaterController.updateTheater);

//----delete----
router.delete('/:id', theaterController.deleteTheater);

module.exports = router;