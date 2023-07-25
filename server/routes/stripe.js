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
            res.redirect('http://127.0.0.1:5173/premium');
        } else {
            res.status(400).send(result.reason);
        }
    } catch (error) {
        res.status(400).send({ error: 'An error occurred when verifying the Stripe session or inserting data into the database', details: error.message });
    }
});




/*
router.post('/webhook', async (req, res) => {
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody, req.headers['stripe-signature'], 'YOUR_WEBHOOK_SECRET'
        );
    } catch (err) {
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            const data = {
                userId: "1",
                itemId: "premiumPackage",
                itemName: "Premium Package",
                amount: 10,
                purchaseDate: new Date(),
            };

            await paymentController.createPurchasedItem(data);
            res.status(200).send({ success: true });
            break;
        default:
            // Unexpected event type
            return res.status(400).end();
    }
});
*/


module.exports = router;
