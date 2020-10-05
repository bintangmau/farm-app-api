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
    }
}