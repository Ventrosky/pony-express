const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const requireAuth = require('../lib/require-auth');
const generateId = require('../lib/generate-id');
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
    let attachments = (req.files || []).map(file =>{
            return {"url": '/uploads/' + file.filename, "type": file.mimetype};
        }
    );
    let newEmail = {...req.body, id: generateId(), attachments};
    emails.push(newEmail);
    res.status(201);
    res.send(newEmail);
};

let updateEmailRoute = async (req, res) => {
    let email = emails.find(email => email.id === req.params.id);

    let newAttachments = req.files.map(file =>{
            return {"url": '/uploads/' + file.filename, "type": file.mimetype};
        }
    );
    req.body.attachments = [...email.attachments, ...newAttachments]
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

emailsRouter.use(requireAuth);

emailsRouter.route('/')
    .get(getEmailsRoute)
    .post(
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }), 
        upload.array('attachments'),
        createEmailRoute
    );

emailsRouter.route('/:id')
    .get(getEmailRoute)
    .patch(
        bodyParser.json(), 
        bodyParser.urlencoded({ extended: true }), 
        upload.array('attachments'),
        updateEmailRoute)
    .delete(deleteEmailRoute);

module.exports = {
    emailsRouter,
    emails
}