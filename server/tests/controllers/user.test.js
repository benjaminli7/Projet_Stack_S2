const express = require("express");
const router = express.Router();
const request = require('supertest');
const UserRepository = require('../../services/user');

const { Sequelize } = require("sequelize");
//const db = require("../db"); // Assuming "../db" exports the Sequelize instance
const ValidationError = require("../errors/ValidationError");

// Mocking User model for testing purposes
jest.mock( () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

// Mocking ValidationError.createFromSequelizeValidationError method
jest.mock("../errors/ValidationError", () => ({
  createFromSequelizeValidationError: jest.fn(),
}));

describe("UserRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should call User.findAll with provided criteria and options", async () => {
      const criteria = { active: true };
      const options = { order: [["createdAt", "DESC"]] };
      await UserRepository.findAll(criteria, options);

      expect(User.findAll).toHaveBeenCalledWith({
        where: criteria,
        ...options,
        order: Object.entries(options.order || {}),
      });
    });
  });

  describe("findById", () => {
    it("should call User.findByPk with the provided id", async () => {
      const id = 123;
      await UserRepository.findById(id);

      expect(User.findByPk).toHaveBeenCalledWith(id);
    });
  });

  describe("create", () => {
    it("should call User.create with the provided data", async () => {
      const data = { name: "John Doe", email: "john@example.com" };
      await UserRepository.create(data);

      expect(User.create).toHaveBeenCalledWith(data);
    });

    it("should throw a ValidationError when a Sequelize.ValidationError is caught", async () => {
      const data = { invalidField: "value" };
      const error = new Sequelize.ValidationError("Validation error message");
      User.create.mockRejectedValueOnce(error);

      await expect(UserRepository.create(data)).rejects.toThrow(ValidationError);

      expect(ValidationError.createFromSequelizeValidationError).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should call User.update with the provided criteria and data", async () => {
      const criteria = { id: 123 };
      const data = { name: "Updated Name" };
      const returnValue = [1, [{ id: 123, name: "Updated Name" }]];
      User.update.mockResolvedValueOnce(returnValue);

      const result = await UserRepository.update(criteria, data);

      expect(User.update).toHaveBeenCalledWith(data, {
        where: criteria,
        returning: true,
        individualHooks: true,
      });
      expect(result).toEqual([{ id: 123, name: "Updated Name" }]);
    });

    it("should throw a ValidationError when a Sequelize.ValidationError is caught", async () => {
      const criteria = { id: 123 };
      const data = { invalidField: "value" };
      const error = new Sequelize.ValidationError("Validation error message");
      User.update.mockRejectedValueOnce(error);

      await expect(UserRepository.update(criteria, data)).rejects.toThrow(ValidationError);

      expect(ValidationError.createFromSequelizeValidationError).toHaveBeenCalledWith(error);
    });
  });

  describe("remove", () => {
    it("should call User.destroy with the provided criteria", async () => {
      const criteria = { id: 123 };
      await UserRepository.remove(criteria);

      expect(User.destroy).toHaveBeenCalledWith({
        where: criteria,
      });
    });
  });
});
