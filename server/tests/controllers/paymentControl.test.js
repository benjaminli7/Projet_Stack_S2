jest.mock('sequelize', () => {
    const mSequelize = {
        define: jest.fn(),
        sync: jest.fn(),
    };
    const mSequelizeClass = jest.fn(() => mSequelize);
    mSequelizeClass.Op = {};
    return mSequelizeClass;
});

jest.mock('../../db', () => ({
    PurchasedItem: {
        findOne: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn(),
    },
    User: {} // Add necessary methods if required
}));

jest.mock('stripe', () => {
    const mSessions = {
        create: jest.fn(),
        retrieve: jest.fn(),
    };
    const mStripe = {
        checkout: {
            sessions: mSessions
        }
    };
    return jest.fn(() => mStripe);
});


const {
    checkIfItemPurchased,
    createPurchasedItem,
    createPaymentSession,
    handlePurchaseSuccess,
    allPurchasedItems
} = require('../../controllers/paymentControl');

const stripe = require('stripe')();

describe('Payment Controller', () => {

    describe('checkIfItemPurchased', () => {
        it('should check if an item has been purchased by the user', async () => {
            const PurchasedItem = require('../../db').PurchasedItem;
            PurchasedItem.findOne.mockResolvedValue({ some: 'data' });

            const result = await checkIfItemPurchased(1);
            expect(result).toBe(true);
        });

        it('should return false if no item has been purchased by the user', async () => {
            const PurchasedItem = require('../../db').PurchasedItem;
            PurchasedItem.findOne.mockResolvedValue(null);

            const result = await checkIfItemPurchased(1);
            expect(result).toBe(false);
        });
    });

    describe('createPurchasedItem', () => {
        it('should create a purchased item', async () => {
            const mockData = { userId: 1, itemId: '123' };
            const PurchasedItem = require('../../db').PurchasedItem;
            PurchasedItem.create.mockResolvedValue(mockData);

            const result = await createPurchasedItem(mockData);
            expect(result).toEqual(mockData);
        });
    });

    describe('createPaymentSession', () => {
        it('should create a payment session', async () => {
            const mockSession = { id: 'sessionId' };
            stripe.checkout.sessions.create.mockResolvedValue(mockSession);

            const result = await createPaymentSession(1, '123', 'Test Item', 100);
            expect(result).toEqual(mockSession);
        });
    });

    describe('handlePurchaseSuccess', () => {
        it('should handle purchase success and create purchased item', async () => {
            const mockSession = {
                payment_status: 'paid',
                metadata: {
                    userId: 1,
                    itemId: '123',
                    itemName: 'Test Item',
                    amount: '100'
                }
            };
            stripe.checkout.sessions.retrieve.mockResolvedValue(mockSession);

            const result = await handlePurchaseSuccess('sessionId');
            expect(result).toEqual({ status: "success" });
        });
    });

    describe('allPurchasedItems', () => {
        it('should return all purchased items', async () => {
            const mockData = [{ userId: 1, itemId: '123', user: { id: 1, username: 'test' } }];
            const PurchasedItem = require('../../db').PurchasedItem;
            PurchasedItem.findAll.mockResolvedValue(mockData);

            const mockRes = {
                json: jest.fn().mockReturnThis(),
            };

            await allPurchasedItems({}, mockRes);
            expect(mockRes.json).toHaveBeenCalledWith(mockData);
        });
    });
});
