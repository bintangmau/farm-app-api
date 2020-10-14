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
        const qtyArr = req.body.qty_item
        var finalData = []
        var messageQty = []
        arrItem.forEach((val) => {
            finalData.push({idItem: val})
        })
        qtyArr.forEach((val, idx) => {
            finalData[idx].qty = val
        })
        finalData.map((val) => {
            const sqlEditQtyItem = `UPDATE toko.barang SET jumlah_barang = jumlah_barang - ${val.qty} WHERE id_barang = ${val.idItem};`

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
    getDataSales2: (req, res) => {
        const sql = `SELECT id_sales, fid_owner, fid_customer, "value", jumlah_item, tanggal 
        FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_sales;
        
        SELECT id_sales, fid_item FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_sales;
        SELECT id_sales, fid_supplier FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_sales;`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            var dataSale = results[0].rows
            var arrItem = results[1].rows
            var arrSupplier = results[2].rows

            var dataIdItem = []
            arrItem.forEach((val) => {
                console.log(val)
                 
            })

            // var dataItem = [
            //     {
            //         id_sales: 1,
            //         name: [
            //             {   
            //                 id_barang: 1,
            //                 nama_barang: "pakanayam"
            //             },
            //             {
            //                 id_barana: 1,
            //                 nama_barang: "vaksin"
            //             }
            //         ]
            //     },
            //     {
            //         id_sales: 2,
            //         name: [
            //             {   
            //                 id_barang: 1,
            //                 nama_barang: "pakanayam"
            //             },
            //             {
            //                 id_barana: 1,
            //                 nama_barang: "vaksin"
            //             }
            //         ]
            //     }
            // ]
            // var dataItem = []
            // var data = []

            // const fillData = (id_sales, name, idx) => {
            //     var toFill = {
            //         id_sales,
            //         name
            //     }

            //     data.push(toFill)
            // }
        
            // arrItem.map((val, index) => {
            //     dataItem.push({id_sales: val.id_sales})
            //     var idItem = val.fid_item
                
            //     var dataName = []
               
            //     idItem.map((val2, idx) => {
            //         const sqlGetNameItem = `SELECT id_barang, nama_barang FROM toko.barang WHERE id_barang = ${val2};`
            //         db.query(sqlGetNameItem, (err, resultNameItem) => {
            //             if(err) {
            //                 console.log(err)
            //             }
            //             var name = resultNameItem.rows[0].nama_barang  
            //             var idBarang = resultNameItem.rows[0].id_barang
            //             dataName.push({idItem: idBarang, name})
            //             // console.log(dataName)
            //             dataItem[idx].data_sales = dataName      
            //             fillData(idItem, name, idx)                 
            //             console.log(dataItem[index], "SINI COK")
            //         })
            //     })
            // })
            res.status(200).send(results[0].rows)
        })
    },
    getDataSales3: async (req, res) => {
        const sql = `SELECT id_sales, fid_owner, fid_customer, fid_item, "value", jumlah_item, tanggal 
        FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_sales;
        
        SELECT id_sales, fid_item FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_sales;
        SELECT id_sales, fid_supplier FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_sales;`

        try {

        let results = await db.query(sql)
            
            var dataSale = results[0].rows
            var arrItem = results[1].rows
            var arrSupplier = results[2].rows
            var dataName = []
            for (let i in arrItem) {

                var arrIdItem = arrItem[i].fid_item

                for (let o = 0;o < arrIdItem.length; o++) {
                    const sqlGetNameItem = `SELECT id_barang, nama_barang FROM toko.barang WHERE id_barang = ${arrIdItem[o]};`
                    const resultNameItem = await db.query(sqlGetNameItem)

                    var namaItem = resultNameItem.rows[0].nama_barang
                    var idd = resultNameItem.rows[0].id_barang
                    // console.log(dataSale[i])
                    function checkId(idd) {
                        return Number(idd) === Number(dataSale[i].fid_item);
                    }
                    var arr2 = dataName.filter(checkId);
                    // console.log(arr2, "ARR 2")
                    // console.log(arr2)
                    // console.log(i, "INDEX")
                    
                    dataSale[i].fid_item.map((val) => {
                        console.log(val + " = " + idd)
                        if(Number(val) === Number(idd)) {
                            console.log("MASUk")
                            dataName.push(namaItem)
                        } else {
                            return null
                        }
                    })
                    // console.log(o, "INDEX 2")
                    // console.log(idd, "IDD")
                    // console.log(arrIdItem[i], "idItem")
                    // console.log(dataName, "DATA NAME")
                    dataSale[i].nama_barang = dataName
                }
            }

            console.log(dataSale, "DATA AKHIR")
        // db.query(sql, (err, results) => {
        //     if(err) {
        //         res.status(500).send(err)
        //     }


        //     var dataIdItem = []
        //     arrItem.forEach((val) => {
        //         console.log(val)
                 
        //     })

            // var dataItem = [
            //     {
            //         id_sales: 1,
            //         name: [
            //             {   
            //                 id_barang: 1,
            //                 nama_barang: "pakanayam"
            //             },
            //             {
            //                 id_barana: 1,
            //                 nama_barang: "vaksin"
            //             }
            //         ]
            //     },
            //     {
            //         id_sales: 2,
            //         name: [
            //             {   
            //                 id_barang: 1,
            //                 nama_barang: "pakanayam"
            //             },
            //             {
            //                 id_barana: 1,
            //                 nama_barang: "vaksin"
            //             }
            //         ]
            //     }
            // ]
            // var dataItem = []
            // var data = []

            // const fillData = (id_sales, name, idx) => {
            //     var toFill = {
            //         id_sales,
            //         name
            //     }

            //     data.push(toFill)
            // }
        
            // arrItem.map((val, index) => {
            //     dataItem.push({id_sales: val.id_sales})
            //     var idItem = val.fid_item
                
            //     var dataName = []
               
            //     idItem.map((val2, idx) => {
            //         const sqlGetNameItem = `SELECT id_barang, nama_barang FROM toko.barang WHERE id_barang = ${val2};`
            //         db.query(sqlGetNameItem, (err, resultNameItem) => {
            //             if(err) {
            //                 console.log(err)
            //             }
            //             var name = resultNameItem.rows[0].nama_barang  
            //             var idBarang = resultNameItem.rows[0].id_barang
            //             dataName.push({idItem: idBarang, name})
            //             // console.log(dataName)
            //             dataItem[idx].data_sales = dataName      
            //             fillData(idItem, name, idx)                 
            //             console.log(dataItem[index], "SINI COK")
            //         })
            //     })
            // })
        //     res.status(200).send(results[0].rows)
        // })
    }  

        catch (err) {
            res.status(500).send(err)
        }
    },
    getDataSales: (req, res) => {
        const sqlGet = `SELECT id_sales, fid_owner, fid_customer, fid_item, "value", jumlah_item, tanggal, fid_supplier
        FROM toko.sales  WHERE fid_owner = ${req.logedUser.id_owner};
        
        SELECT s.id_sales, nama_barang
        FROM toko.sales s 
        JOIN toko.barang b
        ON b.id_barang =  ANY (s.fid_item) WHERE s.id_sales = ANY(
            SELECT id_sales FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner});
            
        SELECT s.id_sales, nama_supplier
        FROM toko.sales s 
        JOIN toko.supplier p
        ON p.id_supplier =  ANY (s.fid_supplier) WHERE s.id_sales = ANY(
            SELECT id_sales FROM toko.sales WHERE fid_owner = ${req.logedUser.id_owner});`

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
            console.log(sales ,"DATA AKHIR")
            
        })
    }
}