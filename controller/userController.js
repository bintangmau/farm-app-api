const { db } = require('../helper/database')
const secretPass = require('../helper/secret')

module.exports = {
    loginUser: (req, res) => {
        const sql = `SELECT * FROM "humanResource"."owner" WHERE ownername = '${req.body.username}';`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 
            var message = ''

            if(results.rows.length < 1) {
                message = "Data tidak ada"
            } else {
                message = "Login Success"
            }

            var response = {
                message,
                data: results.rows
            }
            res.status(200).send(response)
        })
    },
    registerUser: (req, res) => {
        const passwordEnc = crypto.createHmac('sha256', secretPass)
        .update(req.body.password)
        .digest('hex');

        const sql = `SELECT COUNT(*) FROM "humanResource"."owner" WHERE ownername = '${req.body.username}' AND password = '${passwordEnc}'`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 
            
            console.log(results.rows)
            res.status(200).send(results.rows)
        })
    }
}