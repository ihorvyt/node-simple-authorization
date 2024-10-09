const { Schema, model} = require('mongoose');

const User = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, unique: false, required: true },
    roles: [{type: String, ref: 'Role.js'}]
})

module.exports = model("User", User);