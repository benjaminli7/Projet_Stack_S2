const express = require('express');
const router = express.Router();
const paymentController = require("../controllers/paymentControl");
const authenticateToken = require('../middlewares/auth.middleware');

router.get("/", authenticateToken , paymentController.allPurchasedItems);

module.exports = router;