const express = require('express');
const stringify = require('csv-stringify')
const builder = require('xmlbuilder');

const users = require('./fixtures/users');
const emails = require('./fixtures/emails');

let app = express();

app.use((req,res)=>{
    let route = req.method + ' ' + req.url;
    let accept = req.accepts(['application/xml','application/json','text/csv'])
    res.type(accept || 'application/json');

    if (route === 'GET /users') {
        switch (accept){
            case 'application/xml':
                let root = builder.create('users');
                users.map(u => root.ele({"user":u}));
                let xml = root.end({ pretty: true});
                res.end(xml);
                break;
            case 'text/csv':
                let formatUsers = [ Object.keys(users[0]), ...users.map(i=> Object.values(i))]
                stringify(formatUsers, function(err, output) {
                    res.end(output);
                });
                break;
            case 'application/json':
            default:
                    res.send(users);
                break;
        }
    } else if (route === 'GET /emails') {
        switch (accept){
            case 'application/xml':
                let root = builder.create('emails');
                emails.map(u => root.ele({"email":u}));
                let xml = root.end({ pretty: true});
                res.end(xml);
                break;
            case 'text/csv':
                let formatEmails = [ Object.keys(emails[0]), ...emails.map(i=> Object.values(i))]
                stringify(formatEmails, function(err, output) {
                    res.end(output);
                });
                break;
            case 'application/json':
            default:
                    res.send(emails);
                break;
        }
    } else {
        res.end('You asked for ' + route);
    }
});

app.listen(3000);