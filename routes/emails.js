const express = require('express');
const readBody = require('../lib/read-body');
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

let getEmailRoute = (req, res) => {
    let email = emails.find(email => email.id === req.params.id);
    res.send(email);
}

let createEmailRoute = async (req, res) => {
    let body = await readBody(req);
    let newEmail = {...JSON.parse(body), id: generateId()};
    emails.push(newEmail);
    res.status(201);
    res.send(newEmail);
};

let updateEmailRoute = async (req, res) => {
    let body = await readBody(req);
    let email = emails.find(email => email.id === req.params.id);
    Object.assign(email, JSON.parse(body));
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
    .post(createEmailRoute);

emailsRouter.route('/:id')
    .get(getEmailRoute)
    .patch(updateEmailRoute)
    .delete(deleteEmailRoute);

module.exports = emailsRouter;