var express = require('express');
var router = express.Router();
let userController = require("../controller/userController")
let restro = require("../controller/restrauntController")


router.post('/signup',userController.signUp);
router.post('/slot',restro.custReservation);


module.exports = router;
