const readBody = require('./read-body');

let jsonBodyParser = async (req, res, next) => {
    let body = await readBody(req);
    req.body = JSON.parse(body);
    next();
};

module.exports = jsonBodyParser;