const {
    create,
    getByUsername,
    getAll,
    getByAuthenticatedUser,
    countGame,
    last5Games
} = require("../../controllers/gameStats");

jest.mock("../../db/mongoModels", () => {
    const MockedGameStats = jest.fn();
    MockedGameStats.prototype.save = jest.fn();
    return {
        gameStats: MockedGameStats
    };
});

describe('Game Controller', () => {
    const MockedGameStats = require("../../db/mongoModels").gameStats;

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create game stats', async () => {
            const mockReq = {
                body: {
                    someProperty: 'someValue'
                }
            };
            await create(mockReq, {});
            expect(MockedGameStats.prototype.save).toHaveBeenCalled();
        });
    });

    describe('getByUsername', () => {
        it('should retrieve game stats by username', async () => {
            MockedGameStats.find = jest.fn().mockResolvedValue([{ game: 'test' }]);

            const req = {
                params: { username: 'testUser' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await getByUsername(req, res);
            expect(res.json).toHaveBeenCalledWith([{ game: 'test' }]);
        });
    });

    describe('getAll', () => {
        it('should retrieve all game stats', async () => {
            MockedGameStats.find = jest.fn().mockResolvedValue([{ game: 'test1' }, { game: 'test2' }]);

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await getAll({}, res);
            expect(res.json).toHaveBeenCalledWith([{ game: 'test1' }, { game: 'test2' }]);
        });
    });

    describe('getByAuthenticatedUser', () => {
        it('should retrieve game stats by authenticated user', async () => {
            MockedGameStats.aggregate = jest.fn().mockResolvedValue([{
                currentPlayer: {
                    username: 'authUser',
                    guesses: [],
                    outcome: 'win',
                    score: 100
                },
                positions: [],
                date: new Date()
            }]);

            const req = {
                user: { infos: { username: 'authUser' } }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await getByAuthenticatedUser(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                totalGames: 1,
                victories: 1,
                winRate: "100.00"
            }));
        });
    });


    describe('countGame', () => {
        it('should count game stats', async () => {
            MockedGameStats.countDocuments = jest.fn().mockResolvedValue(5);

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await countGame({}, res);
            expect(res.json).toHaveBeenCalledWith(5);
        });
    });

    describe('last5Games', () => {
        it('should retrieve the last 5 games', async () => {
            MockedGameStats.find = jest.fn().mockResolvedValue([
                { game: 'game1' },
                { game: 'game2' },
                { game: 'game3' },
                { game: 'game4' },
                { game: 'game5' },
            ]);

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await last5Games({}, res);
            expect(res.json).toHaveBeenCalledTimes(1);
        });
    });
});
