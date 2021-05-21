const express = require('express');
const router = express.Router();

//---
const sessionController = require('../controllers/sessionController');

//---get all----
router.get('/', sessionController.getAll);

//---get by id----
router.get('/:id', sessionController.getOne);

//----post----
router.post('/', sessionController.newSession);

//----delete----
router.delete('/:id', sessionController.deleteSession);

module.exports = router;