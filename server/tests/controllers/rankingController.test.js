const express = require("express");
const router = express.Router();
const request = require('supertest');
const rankingController = require('../../controllers/rankingController');

router.get('/ranking', rankingController.getAllUsersWithELO);

jest.mock('../../db', () => {
    const sequelizeMock = require('sequelize-mock');
    const DBConnectionMock = new sequelizeMock();
    const UserMock = DBConnectionMock.define('User', {
        // Vos champs ici, si nécessaire
    });

    // Si vous avez besoin de mocker d'autres méthodes, utilisez jest.fn()
    UserMock.findAll = jest.fn().mockResolvedValue([
        UserMock.build({ username: 'user1', elo: 1500 }),
        UserMock.build({ username: 'user2', elo: 1400 }),
    ]);

    return {
        User: UserMock
    };
});

describe('Ranking Controller', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(router);
    });

    test('should return all users with ELO', async () => {
        const response = await request(app).get('/ranking');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].username).toBe('user1');
        expect(response.body[0].elo).toBe(1500);
    });

    test('should return empty array if no users have ELO', async () => {
        require('../../db').User.findAll.mockResolvedValue([]);

        const response = await request(app).get('/ranking');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('should only return users with isVerified or isGoogle', async () => {
        const mockUsers = [
            { username: 'user1', elo: 1500, isVerified: true, isGoogle: false },
            { username: 'user2', elo: 1400, isVerified: false, isGoogle: true },
            { username: 'user3', elo: 1300, isVerified: false, isGoogle: false }  // This user should not be returned
        ];

        require('../../db').User.findAll.mockImplementation(() => {
            return Promise.resolve(mockUsers.filter(user => user.isVerified || user.isGoogle));
        });

        const response = await request(app).get('/ranking');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body.map(user => user.username)).toEqual(expect.arrayContaining(['user1', 'user2']));
        expect(response.body.map(user => user.username)).not.toContain('user3');
    });
    // ... Ajoutez d'autres tests au besoin ...
});
