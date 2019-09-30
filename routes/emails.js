const express = require('express');
const jsonBodyParser = require('../lib/json-body-parser');
const generateId = require('../lib/generate-id');
const emails = require('../fixtures/emails');

const stringify = require('csv-stringify');
const builder = require('xmlbuilder');

let getEmailsRoute = (req, res) => {
    res.format({
        'application/xml': function () {
            let root = builder.create('emails');
            emails.map(u => root.ele({"email":u}));
            let xml = root.end({ pretty: true});
            res.end(xml);
        },
        'text/csv': function () {
            let formatEmails = [ Object.keys(emails[0]), ...emails.map(i=> Object.values(i))]
            stringify(formatEmails, function(err, output) {
                res.end(output);
            });
        },
        'application/json': function () {
            res.send(emails);
        },
        'default': function () {
          res.status(406).send('Not Acceptable')
        }
    });
};
class NotFound extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFound';
    }
}

let getEmailRoute = (req, res) => {
    let email = emails.find(email => email.id === req.params.id);
    if (!email) { throw new NotFound(); }
    res.send(email);
}

let createEmailRoute = async (req, res) => {
    let newEmail = {...req.body, id: generateId()};
    emails.push(newEmail);
    res.status(201);
    res.send(newEmail);
};

let updateEmailRoute = async (req, res) => {
    let email = emails.find(email => email.id === req.params.id);
    Object.assign(email, req.body);
    res.status(200);
    res.send(email);
};

let deleteEmailRoute = (req, res) => {
    let index = emails.findIndex(email => email.id === req.params.id);
    emails.splice(index, 1);
    res.sendStatus(204);
};

let emailsRouter = express.Router();

emailsRouter.route('/')
    .get(getEmailsRoute)
    .post(jsonBodyParser, createEmailRoute);

emailsRouter.route('/:id')
    .get(getEmailRoute)
    .patch(jsonBodyParser, updateEmailRoute)
    .delete(deleteEmailRoute);

module.exports = emailsRouter;