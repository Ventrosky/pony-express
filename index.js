const express = require('express');

const usersRouter = require('./routes/users');
const emailsRouter = require('./routes/emails');

let app = express();

app.use('/users',usersRouter);
app.use('/emails',emailsRouter);

app.listen(3000);