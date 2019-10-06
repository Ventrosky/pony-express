const jwt = require('jsonwebtoken');

const signature = process.env.SIGNATURE;

let tokenAuth = (findUserByToken) => (req, res, next) => {
    let header = req.headers.authorization || '';
    let [type, token] = header.split(' ');

    if (type === 'Bearer') {
        let payload = {}
        try {
            payload = jwt.verify(token, signature);
        } catch(err) {
            res.sendStatus(401);
            return;
        }
        let user = findUserByToken(payload);
        if (user) {
            req.user = user;
        } else {
            res.sendStatus(401);
            return;
        }
    }

    next();
};

module.exports = tokenAuth;