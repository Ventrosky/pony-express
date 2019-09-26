const express = require('express');
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


let emailsRouter = express.Router();

emailsRouter.get('/', getEmailsRoute);
emailsRouter.get('/:id', getEmailRoute);

module.exports = emailsRouter;