const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const requireAuth = require('../lib/require-auth');
const generateId = require('../lib/generate-id');
const enforce = require('../lib/enforce');
const NotFound = require('../lib/not-found');
const emails = require('../fixtures/emails');

let upload = multer({ dest: path.join(__dirname, '../uploads')});

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
    req.authorize(email);
    if (!email) { throw new NotFound(); }
    res.send(email);
}

let createEmailRoute = async (req, res) => {
    let attachments = (req.files || []).map(file =>{
            return {"url": '/uploads/' + file.filename, "type": file.mimetype};
        }
    );
    let newEmail = {...req.body, id: generateId(), attachments};
    req.authorize(newEmail);
    emails.push(newEmail);
    res.status(201);
    res.send(newEmail);
};

let updateEmailRoute = async (req, res) => {
    let email = emails.find(email => email.id === req.params.id);
    req.authorize(email);
    let newAttachments = (req.files || []).map(file =>{
            return {"url": '/uploads/' + file.filename, "type": file.mimetype};
        }
    );
    req.body.attachments = [...email.attachments, ...newAttachments]
    Object.assign(email, req.body);
    
    res.status(200);
    res.send(email);
};

let deleteEmailRoute = (req, res) => {
    let email = emails.find(email => email.id === req.params.id);
    req.authorize(email);
    let index = emails.findIndex(email => email.id === req.params.id);
    emails.splice(index, 1);
    res.sendStatus(204);
};

let updateEmailPolicy = (user, email) => user.id === email.from;

let deleteEmailPolicy = (user, email) => user.id === email.to;

let getEmailPolicy = (user, email) => (user.id === email.to) || (user.id === email.from);

let createEmailPolicy = (user, email) => user.id === email.from;


let emailsRouter = express.Router();

emailsRouter.use(requireAuth);

emailsRouter.route('/')
    .get(getEmailsRoute)
    .post(
        enforce(createEmailPolicy),
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }), 
        upload.array('attachments'),
        createEmailRoute
    );

emailsRouter.route('/:id')
    .get(
        enforce(getEmailPolicy), 
        getEmailRoute)
    .patch(
        enforce(updateEmailPolicy),
        bodyParser.json(), 
        bodyParser.urlencoded({ extended: true }), 
        upload.array('attachments'),
        updateEmailRoute)
    .delete(
        enforce(deleteEmailPolicy),
        deleteEmailRoute);

module.exports = {
    emailsRouter,
    emails
}