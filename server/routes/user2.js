var express = require('express');
var router = express.Router();
const userController = require("../controllers/user");

const use = fn => (req,res,next)=>
  Promise.resolve(fn(req, res, next)).catch(next)


router.post('/', use(userController.post));

module.exports = router;