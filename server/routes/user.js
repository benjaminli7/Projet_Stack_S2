// const { Router } = require("express");
// const userController = require("../controllers/user");
// const router = Router();

// router.get("/", userController.cget);
// router.post("/", userController.post);
// router.get("/:id", userController.get);
// router.put("/:id", userController.put);
// router.patch("/:id", userController.patch);
// router.delete("/:id", userController.delete);

// module.exports = router;


var express = require('express');
var router = express.Router();
const userController = require("../controllers/user");

const use = fn => (req,res,next)=>
  Promise.resolve(fn(req, res, next)).catch(next)


router.post('/', use(userController.post));
