const { db } = require('../helper/database')

module.exports = {
    addNewCustomer: (req, res) => {
        const sql = `INSERT INTO toko.customer
            (customer_name, customer_address, customer_phone, join_date, fid_owner)
        VALUES ('${req.body.name}', '${req.body.address}', '${req.body.phone}', NOW(), ${req.logedUser.id_owner});`
        console.log(req.body)
        db.query(sql, (err, results) => {
            if(err) {
                console.log(err)
                res.status(500).send(err)
            }

            req.app.io.emit('add-customer' , { message : 'sukses' }) 
            res.status(200).send({ message: "input customer success" })
        })
    },
    getDataCustomer: (req, res) => {
        const sql = `SELECT * FROM toko.customer WHERE fid_owner = ${req.logedUser.id_owner};`

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

    }
}