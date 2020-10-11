const { db } = require('../helper/database')

module.exports = {
    addNewBarang: (req, res) => {
        var data = req.body

        const sql = `INSERT INTO toko.barang ("nama_barang", "jumlah_barang", "harga_barang", "satuan_barang", "fid_supplier", "fid_owner")
        VALUES ('${data.nama_barang}', ${data.jumlah_barang}, ${data.harga_barang}, '${data.satuan_barang}', ${data.id_supplier}, ${req.logedUser.id_owner});`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            req.app.io.emit('add-barang-toko' , { message : 'sukses' }) 
            res.status(200).send({ message: "input success" })
        })
    },
    getDataBarang: (req, res) => {
        const sql = `SELECT id_barang, nama_barang, jumlah_barang, harga_barang, satuan_barang, nama_supplier
                FROM toko.barang b 
                JOIN toko.supplier s
                ON b.fid_supplier = s.id_supplier
                WHERE b.fid_owner = ${req.logedUser.id_owner} ORDER BY id_barang;`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    },
    getListSupplier: (req, res) => {
        const sql = `SELECT id_supplier, nama_supplier FROM toko.supplier WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_supplier;`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    },
    editDataBarang: (req, res) => {
        const sql = `UPDATE toko.barang SET harga_barang = ${req.body.harga}, jumlah_barang = ${req.body.jumlah}, 
        satuan_barang = '${req.body.satuan}' WHERE id_barang = ${req.body.id_barang};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            req.app.io.emit('edit-barang-toko' , { message : 'sukses' }) 
            res.status(200).send({ message: "edit success" })
        })
    }
}