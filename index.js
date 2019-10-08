require('dotenv').config();

const path = require('path');
const express = require('express');

const tokensRouter = require('./routes/tokens');
const usersRouter = require('./routes/users');
const emailsRouter = require('./routes/emails');
const uploadsRouter = require('./routes/uploads');
const logger = require('./lib/logger');
const basicAuth = require('./lib/basic-auth');
const tokenAuth = require('./lib/token-auth');
const findUser = require('./lib/find-user');
const compress = require('compression');
const serveStatic = require('serve-static');

let app = express();



app.use(logger);
app.use(compress(/*{ threshold: 0 }*/));
app.use(serveStatic(path.join(__dirname, 'public')));

app.use('/tokens',tokensRouter);
app.use(tokenAuth(findUser.byToken));
app.use(basicAuth(findUser.byCredentials));
app.use('/users',usersRouter);
app.use('/emails',emailsRouter);
app.use('/uploads',uploadsRouter, serveStatic(path.join(__dirname, 'uploads')));

app.listen(3000);