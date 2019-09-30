const path = require('path');
const express = require('express');

const usersRouter = require('./routes/users');
const {emailsRouter, emails} = require('./routes/emails');
const logger = require('./lib/logger');
const compress = require('compression');
const serveStatic = require('serve-static');

let app = express();

app.use(logger);
app.use(compress(/*{ threshold: 0 }*/));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/uploads', serveStatic(path.join(__dirname, 'uploads'), {
    setHeaders: setCustomMimetype
}));
app.use('/users',usersRouter);
app.use('/emails',emailsRouter);


function setCustomMimetype (res, path) {
    let allUploads = emails.reduce(( acc, email) => {
        console.log(email)
        return [...acc, ...email.attachments]
    }, []);
    console.log("allUploads",allUploads)
    console.log(path)
    let id = path.match("\buploads\b(w+)\b")
    let mimetype = allUploads.find(obj => obj.url.match("\buploads\b(w+)\b") === id) || {"type":"text/html"}
    res.setHeader('Content-Type', mimetype.type)
}

app.listen(3000);