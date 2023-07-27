const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentController = require('../controllers/paymentControl');
const authenticateToken = require('../middlewares/auth.middleware');
const BASE_URL = process.env.BASE_URL;

router.get('/check-auth', authenticateToken, (req, res) => {
    res.status(200).json({ isAuthenticated: true });
});

router.post('/checkout', async (req, res) => {

    const { userId, itemId, itemName, amount } = req.body;

    if (typeof userId !== 'string' ||
        typeof itemId !== 'string' ||
        typeof itemName !== 'string' ||
        typeof amount !== 'number' ||
        amount <= 0) {
        return res.status(400).send({ error: 'Invalid data provided' });
    }

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
            res.redirect(`${BASE_URL}/premium?status=success`);
        } else {
            res.redirect(`${BASE_URL}/premium?status=cancel`);
        }
    } catch (error) {
        res.status(400).send({ error: 'An error occurred when verifying the Stripe session or inserting data into the database', details: error.message });
    }
});
router.get('/check-purchase/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const isPurchased = await paymentController.checkIfItemPurchased(userId);
        res.status(200).json({ purchased: isPurchased });
    } catch (error) {
        res.status(500).json({ error: 'Error while checking purchase status', details: error.message });
    }
});

module.exports = router;
