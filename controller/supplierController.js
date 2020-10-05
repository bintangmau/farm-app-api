const { db } = require('../helper/database')

module.exports = {
    addNewSupplier: (req, res) => {
        var data = req.body

        const sql = `INSERT INTO toko.supplier ("nama_supplier", "alamat_supplier", "nomor_supplier", "fid_owner")
        VALUES ('${data.nama_supplier}', '${data.alamat_supplier}', '${data.nomor_supplier}', ${req.logedUser.id_owner});`

        db.query(sql, (err, results) => {
            if(err) {
                console.log(err)
                res.status(500).send(err)
            }

            req.app.io.emit('add-supplier-toko' , { message : 'sukses' }) 
            res.status(200).send({ message: "input success" })
        })
    }
}