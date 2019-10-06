const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const findUser = require("../lib/find-user");

const signature = process.env.SIGNATURE;
 
let createToken = (user) =>
    jwt.sign(
        { userId: user.id },
        signature,
        { expiresIn: process.env.EXPIREIN }
    );

let createTokenRoute = async (req, res) => {
    let credentials = req.body;
    let user = await findUser.byCredentials(credentials);
    if (user) {
        let token = createToken(user);
        res.status(201);
        res.send(token);
    } else {
        res.sendStatus(422);
    }       
 };
  
 let tokensRouter = express.Router();

 tokensRouter.post('/', bodyParser.json(), createTokenRoute);
 
 module.exports = tokensRouter;