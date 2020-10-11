const { db } = require('../helper/database')

module.exports = {
    addNewSupplier: (req, res) => {
        var data = req.body

        const sql = `INSERT INTO toko.supplier ("nama_supplier", "alamat_supplier", "nomor_supplier", "fid_owner")
        VALUES ('${data.nama_supplier}', '${data.alamat_supplier}', '${data.nomor_supplier}', ${req.logedUser.id_owner});`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            req.app.io.emit('add-supplier-toko' , { message : 'sukses' }) 
            res.status(200).send({ message: "input success" })
        })
    },
    getDataSupplier: (req, res) => {
        const sql = `SELECT * FROM toko.supplier WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_supplier;  `

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    },
    editSupplier: (req, res) => {
        const sql = `UPDATE toko.supplier SET alamat_supplier = '${req.body.alamat}', nomor_supplier = '${req.body.nomor}' WHERE id_supplier = ${req.body.id_supplier};`
        
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            req.app.io.emit('edit-supplier-toko' , { message : 'sukses' }) 
            res.status(200).send({ message: 'edit success' })
        })
    },
    searchDataSupplier: (req, res) => {
        const sql = `SELECT * FROM toko.supplier WHERE fid_owner = ${req.logedUser.id_owner} 
        AND LOWER(nama_supplier) LIKE LOWER ('%${req.body.keyword}%') 
        OR LOWER(alamat_supplier) LIKE LOWER('%${req.body.keyword}%')
        OR LOWER(nomor_supplier) LIKE LOWER('%${req.body.keyword}%')
        ORDER BY id_supplier;`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    }
}