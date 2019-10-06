const users = require('../fixtures/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let generateHash = async (pwd) => {
    let hashed = await bcrypt.hash(pwd, saltRounds);
    return hashed;
};

let compareHash = async (pwd, user) => {
    return new Promise(async (resolve, reject) => {
        let cmp = await bcrypt.compare(pwd, user.password);
        resolve( cmp ? user : undefined);
    });
}

const findUser = async (username, password) => {
    let usrPrm = await Promise.all(users.filter(user => user.username === username ).map(user => compareHash(password, user))).then((response) => {
        return response.find(u => u !== undefined) || undefined;
    })
    .catch((error) => {
        return undefined;
    });
    return usrPrm
}

let findUserByCredentials = async ({ username, password }) =>{
    return await findUser(username, password);
}

exports.byCredentials = findUserByCredentials;

let findUserByToken = ({ userId }) =>
    users.find(user => user.id === userId);

exports.byToken = findUserByToken;
