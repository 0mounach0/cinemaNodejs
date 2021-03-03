const express = require('express');
const router = express.Router();

//---
const userController = require('../controllers/userController');

//---get all----
router.get('/', userController.getAll);

//---get by id----
router.get('/:id', userController.getOne);

//----post----
router.post('/signup', userController.newUser);
router.post('/login', userController.loginUser);

//----patch-----


//----delete----


module.exports = router;