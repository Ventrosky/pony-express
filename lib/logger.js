let logger = (req, res, next) => {
    console.log(req.method + ' ' + req.url);
    next();
};