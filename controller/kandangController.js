const { db } = require('../helper/database')

module.exports = {
    getDataLocation: (req, res) => {
        const sql = `SELECT * FROM kandang."location" WHERE fid_owner = ${req.logedUser.id_owner};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            res.status(200).send(results.rows)
        })
    },
    addLocation: (req, res) => {
        const sql = `INSERT INTO kandang."location" (fid_owner, location_name)
        VALUES (${req.logedUser.id_owner}, '${req.body.location_name}');`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            res.status(200).send({ message: 'Add Location Success' })
        })
    },
    getDataKandang: (req, res) => {
        const sql = `SELECT * FROM kandang.unit WHERE fid_owner = ${req.logedUser.id_owner} AND fid_location = ${req.params.id_location};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            res.status(200).send(results.rows)
        })
    },
    addKandang: (req, res) => {
        const sql = `INSERT INTO kandang.unit (fid_owner, fid_location, unit_name)
                VALUES (${req.logedUser.id_owner}, ${req.body.id_location}, '${req.body.unit_name}');`
        console.log(sql)
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            res.status(200).send({ message: 'Add Unit Success' })
        })
    },
    getDataRows: (req, res) => {
        const sql = `SELECT * FROM kandang."rows" WHERE fid_owner = ${req.logedUser.id_owner} AND fid_location = ${req.body.id_location} AND fid_unit = ${req.body.id_unit};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            res.status(200).send(results.rows)
        })
    },
    addRows: (req, res) => {
        const sql = `INSERT INTO kandang."rows" (fid_owner, fid_location, fid_unit, rows_name)
                VALUES (${req.logedUser.id_owner}, ${req.body.id_location}, ${req.body.id_unit}, '${req.body.rows_name}');`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            res.status(200).send({ message: "Add Rows Success" })
        })
    },
    deleteLocation: (req, res) => {
        const sql = `DELETE FROM kandang."location" WHERE id_location = ${req.params.id_location};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            res.status(200).send({ message: 'Delete Location Success' })
        })
    },
    deleteUnit: (req, res) => {
        const sql = `DELETE FROM kandang.unit WHERE id_unit = ${req.params.id_unit};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            res.status(200).send({ message: 'Delete Unit Success' })
        })
    },
    deleteRows: (req, res) => {
        const sql = `DELETE FROM kandang."rows" WHERE id_rows = ${req.params.id_rows};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            res.status(200).send({ message: 'Delete Rows Success' })
        })
    }
}