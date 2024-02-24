const express = require("express");
const app = express();
const path = require("path");


const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Headers", 'Content-type, Authorization');
    next();
});


const bodyparser = require("body-parser");

app.use(bodyparser.json());

const secretKey = 'My name is Reethikaaa';

const jwtMW = expressJwt.expressjwt({
    secret: secretKey,
    algorithms: ['HS256'],
});

const PORT = 3000;

let users = [
    {
        id:1,
        username:'Reethika',
        password:'123'
    },
    {
        id:2,
        username:'Aryan',
        password:'987'
    }

];


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    let userDetails;

    for (let user of users) {
        if (username === user.username && password === user.password) {
            userDetails = user;
            break;
        }
    }

    if (userDetails) {
        let token = jwt.sign({ id: userDetails.id, username: userDetails.username }, secretKey, { expiresIn: '3m' });
        res.json({
            success: true,
            err: null,
            token
        });
    } else {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Username or Password is incorrect'
        });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see....'
    });
});

app.get('/api/prices', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'The Price is $10$'
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Settings Page'
    });
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or password is incorrect 2'
        });
    } else {
        next(err);
    }
});


app.listen(PORT, () => {
  console.log(` Listening in port ${PORT}`);
});
