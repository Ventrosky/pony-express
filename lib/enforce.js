class UserNotAuthorized extends Error {
    constructor(message){
        super(message);
        this.name = 'UserNotAuthorized';
    }
}

let enforce = (policy) => (req, res, next) => {
    req.authorize = (resource) => {
        if (!policy(req.user, resource)){
            res.sendStatus(403);
            throw new UserNotAuthorized();
        }
    };
    next();
};

module.exports = enforce;