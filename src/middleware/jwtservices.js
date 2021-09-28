const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    var data = jwt.verify(token, process.env.TOKEN_SECRET);

    try {
        if (data.role == "sld") {
            next();
        } else {
            res.status(403);
            res.send({ message: "UNAUTHORIZED" });
            res.end();
        }
    } catch (err) {
        res.status(403);
        res.send({ message: "UNAUTHORIZED" });
        res.end();
    }
};

module.exports = {
    authenticateToken,
};