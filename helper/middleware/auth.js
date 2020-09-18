const jwt = require('jsonwebtoken')
function verifyedToken(token) {
    return jwt.verify(token, "musitofarmapp")
}

function authentication(req, res, next) {
    try {
        let token = req.headers.token
        let decodeToken = verifyedToken(token)
        // console.log(decodeToken , ' <<< DECODE TOKEN')
        req.logedUser = decodeToken
        next()
    } catch (err) {
        res.status(403).send({message: 'NOT-AUTHORIZED'})
    }
}

module.exports = {
    authentication
}