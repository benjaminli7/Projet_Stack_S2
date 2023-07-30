
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const {
    register,
    login,
    logout,

} = require("../../controllers/auth");

const { User } = require("../../db");

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
  it("should return 400 if email or password is missing", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Veuillez saisir tous les champs",
    });
  });

  it("should return 400 if there are validation errors", async () => {
    jest.mock("express-validator", () => {
      return {
        validationResult: jest.fn(() => ({
          isEmpty: () => false,
          array: () => [{ msg: "Validation Error" }],
        })),
      };
    });

    const req = { body: { email: "test@example.com", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: ["Validation Error"] });
  });

  it("should return 404 if the user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const req = { body: { email: "test@example.com", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Utilisateur non trouvé" });
  });

  it("should return 401 if the user is not verified", async () => {
    User.findOne.mockResolvedValue({ isVerified: false });

    const req = { body: { email: "test@example.com", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Veuillez vérifier votre email",
    });
  });

  it("should return 401 if the user is banned", async () => {
    User.findOne.mockResolvedValue({ isVerified: true, status: 1 });

    const req = { body: { email: "test@example.com", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Vous avez été banni impossible de vous connecter",
    });
  });

  it("should return 401 if the password is invalid", async () => {
    User.findOne.mockResolvedValue({ isVerified: true, status: 0 });
    bcrypt.compare.mockResolvedValue(false);

    const req = { body: { email: "test@example.com", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Identifiants invalides" });
  });

  it("should return the user data and a JWT token if login is successful", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      firstname: "John",
      lastname: "Doe"
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fakeToken");

    const req = { body: { email: "test@example.com", password: "password" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "fakeToken",
      user: {
        id: 1,
        firstname: "John",
        lastname: "Doe",
      },
    });
  });

});

// describe("register function", () => {
//     afterEach(() => {
//       jest.clearAllMocks();
//     });
//     describe("register function", () => {
//         it("should return a 201 status and a token with user data when valid credentials are provided", async () => {
//             const req = {
//                 body: {
//                     firstname: "John",
//                     lastname: "Doe",
//                     username: "johndoe",
//                     email: "john@doe.fr",
//                     password: "password123",
//                 },
//             };
//             const res = {
//                 status: jest.fn().mockReturnThis(),
//                 json: jest.fn(),
//             };
//         });
//     });
// });
