const { db } = require('../helper/database')

module.exports = {
    addNewCustomer: (req, res) => {
        const {
            name, address, phone, isGudang
        } = req.body
       
        const sql = `INSERT INTO toko.customer
            (customer_name, customer_address, customer_phone, join_date, fid_owner)
        VALUES ('${name}', '${address}', '${phone}', NOW(), ${req.logedUser.id_owner}) RETURNING id_customer;
                
        UPDATE "humanResource"."owner"
        SET customer_date = NOW()
        WHERE id_owner = ${req.logedUser.id_owner};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            const sqlAddToGudang = `INSERT INTO gudang.gudang (gudang_name, fid_owner, fid_gudang_customer)
                                    VALUES ('${name}', ${req.logedUser.id_owner}, ${results[0].rows[0].id_customer});`
  
            if(isGudang) {
                db.query(sqlAddToGudang, (errAddGudang, resultsAddGudang) => {
                    if(err) {
                        console.log(errAddGudang)
                        res.status(500).send(errAddGudang)
                    }
                    req.app.io.emit('add-customer' , { message : 'sukses' }) 
                    res.status(200).send({ message: "input customer success" })
                })
            } else {   
                req.app.io.emit('add-customer' , { message : 'sukses' }) 
                res.status(200).send({ message: "input customer success" })
            }
        })
    },
    getDataCustomer: (req, res) => {
        const sql = `SELECT * FROM toko.customer WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_customer;`
       
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    },
    searchCustomer: (req, res) => {

        const {
            keyword
        } = req.body

        const sql = `SELECT id_customer, customer_name FROM toko.customer WHERE fid_owner = ${req.logedUser.id_owner} 
                    AND LOWER(customer_name) LIKE LOWER('%${keyword}%') 
                    OR LOWER(customer_address) LIKE LOWER('%${keyword}%');`

        db.query(sql ,(err,results)=>{
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })

    },
    searchCustomer2: (req, res) => {
        const {
            keyword
        } = req.body

        const sql = `SELECT * FROM toko.customer WHERE fid_owner = ${req.logedUser.id_owner} 
                    AND LOWER(customer_name) LIKE LOWER('%${keyword}%') 
                    OR LOWER(customer_address) LIKE LOWER('%${keyword}%');`

        db.query(sql ,(err,results)=>{
            if(err) {
                res.status(500).send(err)
            }

            res.status(200).send(results.rows)
        })
    }
}