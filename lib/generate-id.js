const crypto = require('crypto');

let generateId = () => crypto.randomBytes(8).toString('hex');

module.exports = generateId;