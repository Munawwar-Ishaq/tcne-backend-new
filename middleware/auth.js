const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Auth failed' });
        }
        req.headers['userData'] = decoded;
        next();
    });
};

module.exports = auth;
