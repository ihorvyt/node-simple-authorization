const Router = require('express');
const router = new Router();
const authController = require('./authController');

const { check } = require('express-validator');
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");


router.post('/registration', [
    check('username', 'username cant be empty').notEmpty(),
    check('password', 'min password is 2 and max is 10').notEmpty().isLength({min:2, max: 10}),
], authController.registration)
router.post('/login', authController.login)
router.get('/users', roleMiddleware(['USER', 'ADMIN']), authController.users)

module.exports = router;