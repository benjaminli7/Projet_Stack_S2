
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const {
    register,
    login,
    logout,

} = require("../../controllers/auth");

// Import the models for mocking
const { User } = require("../../db");

// Mock the database models
jest.mock("../../db", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(), 
  },

}));
jest.mock("bcrypt", () => ({
    compare: jest.fn(),
}));
  
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
}));
jest.mock("express-validator", () => ({
    validationResult: jest.fn(),
}));



describe("login function", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    describe("login function", () => {
        it("should return a 200 status and a token with user data when valid credentials are provided", async () => {
        const req = {
            body: {
                email: "user@example.com",
                password: "password123",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        const mockUser = {
            _id: 1,
            firstname: "John",
            lastname: "Doe",
            username: "johndoe",
            email: "user@example.com",
            roles: ["user"],
            status: "active",
            friends: [],
            password: "hashedPassword", 
        };
    
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mockedToken");
    
        await login(req, res);
    
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(jwt.sign).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            token: "mockedToken",
            user: {
            id: 1,
            firstname: "John",
            lastname: "Doe",
            username: "johndoe",
            email: "user@example.com",
            roles: ["user"],
            status: "active",
            friends: [],
            },
        });
        });
    
        it("should return a 401 status and an error message for invalid credentials", async () => {
        const req = {
            body: {
                email: "user@example.com",
                password: "invalidPassword",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        User.findOne.mockResolvedValue(null);
    
        await login(req, res);
    
        expect(User.findOne).toHaveBeenCalledTimes(0);
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Identifiants invalides" });
        });
    
        it("should return a 400 status and validation errors when request body is invalid", async () => {
        const req = {
            body: {

            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        // Simulate validation errors
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: "Invalid email format" }, { msg: "Password is required" }],
        });
    
        await login(req, res);
    
        expect(User.findOne).not.toHaveBeenCalled();
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Veuillez saisir tous les champs" ,
        });
        });
    });
});
