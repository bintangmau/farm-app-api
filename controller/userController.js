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
            var tokens = ''

            if(results.rows.length < 1) {
                res.status(404).send({ message: "Akun Belum terdaftar" })
            } else {
                tokens = createJWTToken(results.rows[0], { message: 'token' })
                var message = "Login Success"
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
                    VALUES ('${req.body.username}', '${passwordEnc}') RETURNING id_owner`
        
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 
            
            var count = Number(results.rows[0].count)
            
            if(count < 1) {
                db.query(sql2, (err, results2) => {
                    if(err) {
                        res.status(500).send(err)
                    } 

                    var lastId = results2.rows[0].id_owner

                    const sqlInsertEgg = `INSERT INTO toko.barang
                    ( nama_barang, jumlah_barang, harga_barang, satuan_barang, fid_supplier, fid_owner)
                    VALUES
                    ('Telur', 0, 0, 'Kg', 0, ${lastId});`

                    db.query(sqlInsertEgg, (err, resultEgg) => {
                        if(err) {
                            res.status(500).send(err)
                        }
  
                        var message = "Register Success"
                        res.status(200).send({ message })
                    })
                })
            } else {
                res.status(404).send({ message: "Account Used" })
            }
        
        })
    }
}