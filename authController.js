const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const {secret} = require("./config");
const {sign} = require("jsonwebtoken");

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }

    return  sign(payload, secret, {expiresIn: '24h'})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const { username, password } = req.body;
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'This username already exist'});
            }
            const hashPassword = bcrypt.hashSync(password, 10);
            const userRole = await Role.findOne({value: "ADMIN"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            await user.save()
            return res.status(200).json({user})
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Registration failed'});
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const candidate = await User.findOne({username})
            if (!candidate) {
                return res.status(400).json({message: 'User with this doesn\'t exist'});
            }
            const validPassword = bcrypt.compare(password, candidate.password)
            if (!validPassword) {
                return res.status(400).json({message: 'Password\'s doensn\'t match'});
            }
            const token = generateAccessToken(candidate._id, candidate.roles)

            return res.json({token})
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Login failed'});
        }
    }


    async users(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch(e) {
            console.log(e)
        }
    }
}

module.exports = new authController()