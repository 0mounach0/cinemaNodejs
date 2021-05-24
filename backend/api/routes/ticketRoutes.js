const express = require('express');
const router = express.Router();

//---
const ticketController = require('../controllers/ticketController');

//---get all----
router.get('/', ticketController.getAll);

//---get by id----
router.get('/:id', ticketController.getOne);

//----post----
router.post('/', ticketController.newTicket);

module.exports = router;