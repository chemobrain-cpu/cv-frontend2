const jwt = require("jsonwebtoken")
require("dotenv").config()
const { User, Admin } = require("../database/databaseConfig")

const secret = process.env.SECRET_KEY

module.exports.generateAccessToken = (email) => {
    const token = jwt.sign({ email: email }, secret, { expiresIn: "500h" });
    return token;
};



module.exports.verifyUser = async (req, res, next) => {
    try {
        let token = req.headers["header"]
        if (!token) {
            throw new Error("a token is needed")
        }
        const decodedToken = jwt.verify(token, secret)
        let user = await User.findOne({ email: decodedToken.email })

        req.user = user
        next()

    } catch (err) {
        console.log(err)
        let error = new Error("not authorize")
        error.statusCode = 301
        error.message = err.message
        return next(error)
    }
}


module.exports.verifyAdmin = async (req, res, next) => {
    try {
        let token = req.headers["header"]
        if (!token) {
            throw new Error("a token is needed")
        }
        const decodedToken = jwt.verify(token, secret)
        let admin = await Admin.findOne({ email: decodedToken.email })
        req.admin = admin
        console.log(req.Admin)
        next()

    } catch (err) {
        console.log(err)
        let error = new Error("not authorize")
        error.message = err.message
        return next(error)
    }
}

module.exports.verifyTransactionToken = async (token) => {
    const decodedToken = jwt.verify(token, secret)
    return decodedToken.email
}
