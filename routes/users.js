const express = require('express');
const requireAuth = require('../lib/require-auth');
const users = require('../fixtures/users');

const stringify = require('csv-stringify');
const builder = require('xmlbuilder');

let getUsersRoute = (req, res) => {
    res.format({
        'application/xml': function () {
            let root = builder.create('users');
            users.map(u => root.ele({"user":u}));
            let xml = root.end({ pretty: true});
            res.end(xml);
        },
        'text/csv': function () {
            let formatUsers = [ Object.keys(users[0]), ...users.map(i=> Object.values(i))]
            stringify(formatUsers, function(err, output) {
                res.end(output);
            });
        },
        'application/json': function () {
            res.send(users);
        },
        'default': function () {
          res.status(406).send('Not Acceptable')
        }
    });
};

let getUserRoute = (req, res) => {
    let user = users.find(user => user.id === req.params.id);
    res.send(user);
};

let usersRouter = express.Router();
usersRouter.use(requireAuth);
usersRouter.get('/', getUsersRoute);
usersRouter.get('/:id', getUserRoute);

module.exports = usersRouter;