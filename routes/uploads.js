const express = require('express');
const requireAuth = require('../lib/require-auth');
const enforce = require('../lib/enforce');
const emails = require('../fixtures/emails');
const NotFound = require('../lib/not-found');

let emailAttachmentPolicy = (user, email) => {
    return user.id === email.from || user.id === email.to;
};

let getUploadRoute = (req, res, next) => {
    let id = req.url.match("^/([a-z0-9]+)$");
    const matchUrl = (obj) => obj.url.match("/uploads/([a-z0-9]+)")[1] === id[1]
    let foundEmail = emails.filter(email => email.attachments.some(matchUrl))
    if (foundEmail.length == 0) { throw new NotFound(); }
    req.authorize(foundEmail[0]);
    
    let mimetype = (foundEmail[0].attachments.find(matchUrl) || {"type":"text/html"}).type;

    res.setHeader('Content-Type', mimetype);
    
    next();
};

let uploadsRouter = express.Router();
uploadsRouter.use(requireAuth);
uploadsRouter.get('/:id', 
                    enforce(emailAttachmentPolicy), 
                    getUploadRoute
                ); 

module.exports = uploadsRouter;