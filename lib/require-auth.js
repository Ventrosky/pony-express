let requireAuth = (req, res, next) => {
    console.log(req.user)
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
};

module.exports = requireAuth;