const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentController = require('../controllers/paymentControl');


router.post('/checkout', async (req, res) => {
    try {
        const session = await paymentController.createPaymentSession(req.body.userId, req.body.itemId, req.body.itemName, req.body.amount);
        res.status(200).send({ sessionId: session.id });
    } catch (error) {
        res.status(400).send({ error: 'An error occurred during the payment', details: error.message });
    }
});

router.get('/purchaseSUCCESS', async (req, res) => {
    try {
        const result = await paymentController.handlePurchaseSuccess(req.query.session_id);
        if(result.status === "success") {
            res.redirect(`http://127.0.0.1:5173/premium?status=success`);
        } else {
            res.redirect(`http://127.0.0.1:5173/premium?status=cancel`);
        }
    } catch (error) {
        res.status(400).send({ error: 'An error occurred when verifying the Stripe session or inserting data into the database', details: error.message });
    }
});
router.get('/check-purchase/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const isPurchased = await paymentController.checkIfItemPurchased(userId);
        res.status(200).json({ purchased: isPurchased });
    } catch (error) {
        res.status(500).json({ error: 'Error while checking purchase status', details: error.message });
    }
});

module.exports = router;
