exports.verifyAdmin = (req, res, next) => {
    if(!req.user.isAdmin) 
        res.status(403).send('Not an admin');
        next();
}