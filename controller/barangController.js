const { db } = require('../helper/database')

module.exports = {
    addNewBarang: (req, res) => {
        var data = req.body

        const minIncome = Number(data.harga_barang) * Number(data.jumlah_barang)

        const sql = `INSERT INTO toko.barang ("nama_barang", "jumlah_barang", "harga_barang", "satuan_barang", "fid_supplier", "fid_owner")
        VALUES ('${data.nama_barang}', ${data.jumlah_barang}, ${data.harga_barang}, '${data.satuan_barang}', ${data.id_supplier}, ${req.logedUser.id_owner});
        
        UPDATE "humanResource"."owner" SET saldo = saldo - ${minIncome}
        WHERE id_owner = ${req.logedUser.id_owner};
        
        UPDATE "humanResource"."owner"
        SET income_date = NOW(), item_date = NOW()
        WHERE id_owner = ${req.logedUser.id_owner};`

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
                WHERE b.fid_owner = ${req.logedUser.id_owner} ORDER BY id_barang DESC; 
                
                SELECT id_owner, jumlah_butir, kg, harga_telur FROM "humanResource"."owner" WHERE id_owner = ${req.logedUser.id_owner};
                                
                SELECT saldo FROM "humanResource"."owner" WHERE id_owner = ${req.logedUser.id_owner};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }
            // var income = 0
            // results[1].rows.forEach((val) => {
            //     income += Number(val.value)
            // })

            const response = {
                data: results[0].rows,
                telur: results[1].rows,
                saldo: Number(results[2].rows[0].saldo)
            }

            res.status(200).send(response)
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
        const {
            status_egg, harga, jumlah_barang, satuan, id_barang, jumlah, harga_barang
        } = req.body
        var sql = ``
        if(status_egg) {
            sql = `UPDATE toko.barang SET harga_barang = ${harga}, jumlah_barang = ${jumlah}, 
            satuan_barang = '${satuan}' WHERE id_barang = ${id_barang};
            
            UPDATE "humanResource"."owner" SET kg = ${jumlah}, harga_telur = ${harga} WHERE id_owner = ${req.logedUser.id_owner};`
        } else {
            sql = `UPDATE toko.barang SET harga_barang = ${harga}, jumlah_barang = ${jumlah}, 
            satuan_barang = '${satuan}' WHERE id_barang = ${id_barang};`
        }
      
        db.query(sql, (err, results) => {
            if(err) {
                console.log(err)
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
                    SELECT saldo FROM "humanResource"."owner" WHERE id_owner = ${req.logedUser.id_owner};
                    SELECT COUNT(*) FROM toko.customer WHERE fid_owner = ${req.logedUser.id_owner};
                    SELECT income_date, item_date, sales_date, supplier_date, customer_date
                        FROM "humanResource"."owner" WHERE id_owner = ${req.logedUser.id_owner};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            const cBarang = results[0].rows[0].count
            const cSupplier = results[1].rows[0].count
            const ownerName = results[2].rows[0].ownername 
            const cSales = results[3].rows[0].count
            const cCustomer = results[5].rows[0].count
            const saldo = results[4].rows[0].saldo 
            const newDate = results[6].rows[0]

            const response = {
                barang: cBarang,
                supplier: cSupplier,
                owner: ownerName,
                sales: cSales,
                customer: cCustomer,
                income: saldo,
                newDate: newDate
            }

            res.status(200).send(response)
        })
    },
    checkOut: (req, res) => {
        const {
            status_egg, data_egg, id_customer, id_item, value, jumlah_item, id_supplier, qty_item
        } = req.body

        const sql = `INSERT INTO toko.sales (fid_owner, fid_customer, fid_item, value, jumlah_item, tanggal, fid_supplier)
        VALUES (${req.logedUser.id_owner}, ${id_customer}, '{${id_item}}', ${value}, ${jumlah_item}, NOW(), '{${id_supplier}}');
        
        UPDATE "humanResource"."owner" SET saldo = saldo + ${value}
        WHERE id_owner = ${req.logedUser.id_owner};
        
        UPDATE "humanResource"."owner"
        SET income_date = NOW(), sales_date = NOW()
        WHERE id_owner = ${req.logedUser.id_owner};`

        const arrItem = id_item
        const qtyArr = qty_item
        var finalData = []
        var messageQty = []
        arrItem.forEach((val) => {
            finalData.push({idItem: val})
        })
        qtyArr.forEach((val, idx) => {
            finalData[idx].qty = val
        })
        finalData.map((val, idx) => {
            var sqlEditQtyItem = ''

            if(status_egg && data_egg.index === idx) {
                sqlEditQtyItem = `UPDATE toko.barang SET jumlah_barang = jumlah_barang - ${val.qty} WHERE id_barang = ${val.idItem};
    
                                 UPDATE "humanResource"."owner" SET kg = kg - ${val.qty} WHERE id_owner = ${req.logedUser.id_owner};`
            } else {
                sqlEditQtyItem = `UPDATE toko.barang SET jumlah_barang = jumlah_barang - ${val.qty} WHERE id_barang = ${val.idItem};`
            }

            db.query(sqlEditQtyItem, (err, resultEditQty) => {
                if(err) {
                    console.log(err)
                    messageQty.push({err})
                } 
            })
        })
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            req.app.io.emit('check-out' , { message : 'sukses' }) 
            res.status(200).send({ message: "check-out-success" })
        })        
    },
    getDataSales: (req, res) => {
        const sqlGet = `SELECT id_sales, s.fid_owner, fid_customer, "value", jumlah_item, tanggal, c.customer_name, c.customer_address
                FROM toko.sales s 
				JOIN toko.customer c
				ON s.fid_customer = c.id_customer
				WHERE s.fid_owner = ${req.logedUser.id_owner}
                ORDER BY id_sales DESC;
        
        SELECT s.id_sales, nama_barang
        FROM toko.sales s 
        JOIN toko.barang b
        ON b.id_barang =  ANY (s.fid_item) WHERE s.id_sales = ANY(
            SELECT id_sales FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner})
            ORDER BY s.id_sales DESC;
            
        SELECT s.id_sales, nama_supplier
        FROM toko.sales s 
        JOIN toko.supplier p
        ON p.id_supplier =  ANY (s.fid_supplier) WHERE s.id_sales = ANY(
            SELECT id_sales FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner})
            ORDER BY s.id_sales DESC;`

        // console.log(sqlGet)
        db.query(sqlGet, (err, resultGet) => {
            if(err) {
                res.status(500).send(err)
            }

            var sales = resultGet[0].rows
            var item = resultGet[1].rows
            var supplier = resultGet[2].rows

            sales.map((val, idx) => {
                var id_sales = val.id_sales
                var dataName = []

                item.map((e) => {
                    var id_sales_item = e.id_sales

                    if(id_sales === id_sales_item) {
                        dataName.push(e.nama_barang)
                    }
                })
                sales[idx].nama_barang = dataName
            })

            sales.map((val, idx) => {
                var id_sales = val.id_sales
                var dataName = []

                supplier.map((e) => {
                    var id_sales_item = e.id_sales

                    if(id_sales === id_sales_item) {
                        dataName.push(e.nama_supplier)
                    }
                })
                sales[idx].nama_supplier = dataName
            })

            res.status(200).send(sales)            
        })
    },
    editHargaTelur: (req, res) => {
        const sql = `UPDATE "humanResource"."owner" 
                    SET harga_telur = ${req.body.harga_telur}
                    WHERE id_owner = ${req.logedUser.id_owner};

                    UPDATE toko.barang SET harga_barang = ${req.body.harga_telur} WHERE nama_barang = 'Telur' AND fid_owner = ${req.logedUser.id_owner};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            req.app.io.emit('edit-harga-telur' , { message : 'sukses' }) 
            res.status(200).send(results.rows)
        })
    },
    getDataBarangBySupplier: (req, res) => {
        const sql = `SELECT b.id_barang, b.nama_barang, b.harga_barang, b.jumlah_barang, b.satuan_barang FROM toko.barang b
                    JOIN toko.supplier s
                    ON b.fid_supplier = s.id_supplier
                    WHERE b.fid_supplier = ${req.body.id_supplier};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    },
    plusJumlahBarang: (req, res) => {
        const sql = `UPDATE toko.barang 
                    SET jumlah_barang = jumlah_barang + ${req.body.value}
                    WHERE id_barang = ${req.body.id_barang};
                    
                    UPDATE "humanResource"."owner"
                    SET saldo = saldo - ${req.body.total}
                    WHERE id_owner = ${req.logedUser.id_owner};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            req.app.io.emit('plus-jumlah-barang' , { message : 'sukses' }) 
            res.status(200).send({ message: "edit success" })
        })
    },
    deleteBarang: (req, res) => {
        const sql = `DELETE FROM toko.barang WHERE id_barang = ${req.params.id};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            req.app.io.emit('delete-barang' , { message : 'sukses' }) 
            res.status(200).send({ message: "Delete Success" })
        })
    }
}