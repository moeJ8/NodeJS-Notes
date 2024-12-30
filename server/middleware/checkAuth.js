exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
       return res.status(401).json({ message: 'Access denied, Unauthorized.' });
    }
}
   