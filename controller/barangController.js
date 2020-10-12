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
    },
    searchDataBarang: (req, res) => {
        const sql = `SELECT id_barang, nama_barang, jumlah_barang, harga_barang, satuan_barang, id_supplier, nama_supplier
                    FROM toko.barang b 
                    JOIN toko.supplier s
                    ON b.fid_supplier = s.id_supplier
                    WHERE b.fid_owner = ${req.logedUser.id_owner}
                    AND 
                    LOWER(nama_barang) LIKE LOWER('%${req.body.keyword}%') ORDER BY id_barang;`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    },
    getCountInToko: (req, res) => {
        const sql = `SELECT COUNT(*) FROM toko.barang WHERE fid_owner = ${req.logedUser.id_owner};
                    SELECT COUNT(*) FROM toko.supplier WHERE fid_owner = ${req.logedUser.id_owner};
                    SELECT ownername FROM "humanResource"."owner" WHERE id_owner = ${req.logedUser.id_owner};
                    SELECT COUNT(*) FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner};
                    SELECT value FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner}; `

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            var cBarang = results[0].rows[0].count
            var cSupplier = results[1].rows[0].count
            var ownerName = results[2].rows[0].ownername 
            var cSales = results[3].rows[0].count
            var income = 0

            results[4].rows.forEach((val) => {
                income += Number(val.value)
            })

            const response = {
                barang: cBarang,
                supplier: cSupplier,
                owner: ownerName,
                sales: cSales,
                income
            }

            res.status(200).send(response)
        })
    },
    checkOut: (req, res) => {
        const sql = `INSERT INTO toko.sales (fid_owner, fid_customer, fid_item, value, jumlah_item, tanggal, fid_supplier)
        VALUES (${req.logedUser.id_owner}, ${req.body.id_customer}, '{${req.body.id_item}}', ${req.body.value}, ${req.body.jumlah_item}, NOW(), '{${req.body.id_supplier}}');`

        const arrItem = req.body.id_item

        // arrItem.map((val) => {
        //     console.log(val)
        //     const sqlEditQtyItem = `UPDATE toko.barang SET jumlah_barang = 1 WHERE id_barang = 1;`
        // })
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            req.app.io.emit('check-out' , { message : 'sukses' }) 
            res.status(200).send({ message: "check-out-success" })
        })        
    }
}