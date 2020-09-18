const { db } = require('../helper/database')

module.exports = {
    getDataLocation: (req, res) => {
        const sql = `SELECT * FROM kandang."location" WHERE fid_owner = ${req.logedUser.id_owner};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 
            // console.log(req.logedUser)
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

            res.status(200).send({ message: 'input location success' })
        })
    }
}