const userService = require("../../services/user");
const { User, Achievement, Moderation, PurchasedItem } = require("../../db");
const { Op } = require("sequelize");
const controller = require("../../controllers/user"); // Replace 'controller' with the actual filename where the functions are defined.

// Mock the database models
jest.mock("../../db", () => ({
  User: {
    findOne: jest.fn(),
  },
  Achievement: {
    findAll: jest.fn(),
  },
  Moderation: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  PurchasedItem: {
    findOne: jest.fn(),
  },
}));

// Mock the response and next functions
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("Controller Tests", () => {
  describe("cget", () => {
    it("should call userService.findAll and return JSON response", async () => {
      const req = {
        query: {
          _page: 1,
          _itemsPerPage: 10,
          _sort: {},
          someOtherCriteria: "value",
        },
      };
      const res = mockResponse();

      // Mock the userService.findAll function to return some data
      userService.findAll = jest.fn().mockResolvedValue(["user1", "user2"]);

      await controller.cget(req, res, mockNext);

      expect(userService.findAll).toHaveBeenCalledWith(
        { someOtherCriteria: "value" },
        {
          offset: 0,
          limit: 10,
          order: {},
        }
      );

      expect(res.json).toHaveBeenCalledWith(["user1", "user2"]);
    });

    it("should call next with an error if userService.findAll throws an error", async () => {
      const req = {
        query: {},
      };
      const res = mockResponse();

      // Mock the userService.findAll function to throw an error
      userService.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

      await controller.cget(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error("Database error"));
    });
  });

  describe("post", () => {
    it("should call userService.create and return status 201 with JSON response", async () => {
      const req = {
        body: {
          username: "testuser",
          email: "test@example.com",
        },
      };
      const res = mockResponse();

      // Mock the userService.create function to return some data
      userService.create = jest.fn().mockResolvedValue({
        id: 1,
        username: "testuser",
        email: "test@example.com",
      });

      await controller.post(req, res, mockNext);

      expect(userService.create).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        username: "testuser",
        email: "test@example.com",
      });
    });

    it("should call next with an error if userService.create throws an error", async () => {
      const req = {
        body: {
          username: "testuser",
          email: "test@example.com",
        },
      };
      const res = mockResponse();

      // Mock the userService.create function to throw an error
      userService.create = jest.fn().mockRejectedValue(new Error("Database error"));

      await controller.post(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error("Database error"));
    });
  });

});
