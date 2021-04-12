const express = require('express');
const router = express.Router();

//---
const userController = require('../controllers/userController');

//---get all----
router.get('/', userController.getAll);
router.get('/isLogged', userController.isLogged);

//---get by id----
router.get('/:id', userController.getOne);

//----post----
router.post('/signup', userController.newUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

//----patch-----
router.patch('/:id', userController.updateUser);

//----delete----


module.exports = router;