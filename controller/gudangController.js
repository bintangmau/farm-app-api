const { db } = require('../helper/database')

module.exports = {
    getGudangLocation: (req, res) => {
        const sql = `SELECT * FROM gudang.gudang WHERE fid_owner = ${req.logedUser.id_owner};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    },
    addGudang: (req, res) => {
        const sql = `INSERT INTO gudang.gudang (gudang_name, fid_owner)
        VALUES ('${req.body.name}', ${req.logedUser.id_owner});`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    },
    getDataItem: (req, res) => {
        const sql = `SELECT * FROM gudang.item WHERE fid_owner = ${req.logedUser.id_owner} AND fid_location = ${req.body.id_location};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    },
    searchDataItem: (req, res) => {
        const sql = `SELECT * FROM gudang.item WHERE fid_owner = ${req.logedUser.id_owner} AND fid_location = ${req.body.id_location} 
                    AND LOWER(nama_barang) LIKE LOWER('%${req.body.keyword}%');`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    }
}