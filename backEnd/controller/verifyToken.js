const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader;
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) return res.status(401).json("token n'est pas valide!");
            req.user = user;
            next();
        })
    } else {
        return res.status(401).json("Vous n'êtes pas authentifié!");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json("Vous n'êtes pas autorisé à faire ça !");
        }
    });
};

const verifyTokenAndOwner = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === "teacher") {
            next();
        } else {
            return res.status(403).json("Vous n'êtes pas autorisé à faire ça !");
        }
    });
};

const verifyTokenAndOwnerOnRUD = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === "teacher" && req.params.id === req.user.id) {
            next();
        } else {
            return res.status(403).json("Vous n'êtes pas autorisé à faire ça !");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json("Vous n'êtes pas autorisé à faire ça !");
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyTokenAndOwner, verifyTokenAndOwnerOnRUD };