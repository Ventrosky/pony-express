const path = require('path');
const express = require('express');

const usersRouter = require('./routes/users');
const emailsRouter = require('./routes/emails');
const logger = require('./lib/logger');
const compress = require('compression');
const serveStatic = require('serve-static');

let app = express();

app.use(logger);
app.use(compress(/*{ threshold: 0 }*/));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/uploads', serveStatic(path.join(__dirname, 'uploads')));
app.use('/users',usersRouter);
app.use('/emails',emailsRouter);

app.listen(3000);