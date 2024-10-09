require('dotenv').config()
const express = require('express');
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose')
const authRouter = require('./authRouter');

const app = express()

app.use(express.json())
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    } catch(e) {
        console.log(e)
    }
}


start()