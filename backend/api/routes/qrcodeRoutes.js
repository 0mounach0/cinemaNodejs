const express = require('express');
const router = express.Router();

//---
const qrcodeController = require('../controllers/qrcodeController');

//---post qrcode ticket----
router.post('/', qrcodeController.postQrcode);

module.exports = router;