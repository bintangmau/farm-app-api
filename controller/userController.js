const { db } = require('../helper/database')
const secretPass = require('../helper/secret')
const crypto = require('crypto')
const { createJWTToken } = require('../helper/jwt')

module.exports = {
    loginUser: (req, res) => {
        const passwordEnc = crypto.createHmac('sha256', secretPass)
        .update(req.body.password)
        .digest('hex');

        const sql = `SELECT id_owner, ownername FROM "humanResource"."owner" WHERE ownername = '${req.body.username}' AND password = '${passwordEnc}';`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 
            var message = ''
            var tokens = ''

            if(results.rows.length < 1) {
                message = "Data tidak ada"
            } else {
                tokens = createJWTToken(results.rows[0], { message: 'token' })
                message = "Login Success"
            }

            var response = {
                message,
                data: results.rows[0],
                token: tokens
            }
            res.status(200).send(response)
        })
    },
    registerUser: (req, res) => {
        const passwordEnc = crypto.createHmac('sha256', secretPass)
        .update(req.body.password)
        .digest('hex');

        const sql = `SELECT COUNT(*) FROM "humanResource"."owner" WHERE ownername = '${req.body.username}' AND password = '${passwordEnc}'`
        const sql2 = `INSERT INTO "humanResource".owner (ownername, password)
                    VALUES ('${req.body.username}', '${passwordEnc}')`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 
            
            var count = Number(results.rows[0].count)
            var message = ""
            console.log(sql2)
            if(count < 1) {
                db.query(sql2, (err, results2) => {
                    if(err) {
                        res.status(500).send(err)
                    } 
                    message = "Register Success"
                    res.status(200).send({ message })
                })
            } else {
                message = "Username Used!"
                res.status(200).send({ message })
            }
        
        })
    }
}