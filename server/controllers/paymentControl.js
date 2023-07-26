const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PurchasedItem } = require('../db');
const { DateTime } = require('luxon');


exports.checkIfItemPurchased = async (userId) => {
    try {
        const purchasedItem = await PurchasedItem.findOne({ where: { userId } });
        return !!purchasedItem;
    } catch (error) {
        throw error;
    }
};

exports.createPurchasedItem = async (data) => {
    try {
        const item = await PurchasedItem.create(data);
        return item;
    } catch (error) {
        throw error;
    }
};

exports.createPaymentSession = async (userId, itemId, itemName, amount) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: itemName,
                    },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            }],
            metadata: {
                userId: userId,
                itemId: itemId,
                itemName: itemName,
                amount: amount.toString()
            },
            mode: 'payment',
            success_url: `http://127.0.0.1:3000/stripe/purchaseSUCCESS?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'http://127.0.0.1:3000/stripe/purchaseSUCCESS?session_id={CHECKOUT_SESSION_ID}',
        });
        return session;
    } catch (error) {
        throw error;
    }
};

exports.handlePurchaseSuccess = async (sessionId) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log(session.metadata);

        if (session && session.payment_status === 'paid') {
            const utcNow = DateTime.utc().toJSDate();
            const data = {
                userId: session.metadata.userId,
                itemId: session.metadata.itemId,
                itemName: session.metadata.itemName,
                amount: parseFloat(session.metadata.amount),
                purchaseDate: utcNow,
            };
            await this.createPurchasedItem(data);
            return { status: "success" };
        }
        return { status: "failure", reason: "Payment not successful or session not valid." };
    } catch (error) {
        throw error;
    }
};
