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
        const sql = `SELECT u.id_unit, u.unit_name, l.location_name, u.fid_location AS id_location 
                FROM kandang.unit u
                JOIN kandang."location" l
                ON l.id_location = u.fid_location
                WHERE u.fid_owner = ${req.logedUser.id_owner} AND u.fid_location = ${req.params.id_location};`
          
            db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 
            // console.log(results.rows)
            res.status(200).send(results.rows)
        })
    },
    addKandang: (req, res) => {
        const sql = `INSERT INTO kandang.unit (fid_owner, fid_location, unit_name)
                VALUES (${req.logedUser.id_owner}, ${req.body.id_location}, '${req.body.unit_name}');`
       
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            res.status(200).send({ message: 'Add Unit Success' })
        })
    },
    getDataRows: (req, res) => {
        const sql = `SELECT * FROM kandang."rows" WHERE fid_owner = ${req.logedUser.id_owner} AND fid_location = ${req.body.id_location} AND fid_unit = ${req.body.id_unit} ORDER BY id_rows;`
        
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
    },
    addDaysRecordReport: (req, res) => {
        var data = req.body
        
        var ekor = data.ayam
        var pakan = data.pakan
        var tray = 0
        var tara = 0
        var netto = 0
        var sisaEkor = 0
        var presentase = 0
        var okg = 0
        var fcr = 0 

        tray = Math.ceil(data.jumlah_butir / 30)
        tara = 0.14 * tray
        netto = data.kg - tara.toFixed(2)
        sisaEkor = ekor - data.mati_afkir
        presentase = Math.ceil(data.jumlah_butir / ekor * 100)
        okg = netto / ekor * 100
        fcr = pakan / netto
        
        const sql = `INSERT INTO kandang.days_record_report 
            (fid_owner, fid_location, fid_unit, fid_rows, 
                jumlah_butir, kg, tray, tara, netto, mati_afkir, sisa_ekor, presentase, 
                "100/kg", fcr, ayam, pakan, tanggal)
            VALUES 
            (${req.logedUser.id_owner}, ${data.id_location}, ${data.id_unit}, ${data.id_rows},
                '${data.jumlah_butir}', '${data.kg}', '${tray}', '${tara.toFixed(2)}', '${netto.toFixed(2)}', '${data.mati_afkir}', '${sisaEkor}', '${presentase}', 
                '${okg.toFixed(2)}', '${fcr.toFixed(2)}', '${ekor}', '${pakan}', NOW());`
        // console.log(data)
        // console.log(sql)
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            res.status(200).send({ message: 'Input Record Success' })
        })
    },
    getDaysRecordReport: (req, res) => {
        const sql = `SELECT * FROM kandang.days_record_report
            WHERE fid_rows = ${req.params.id_rows} ORDER BY id_record_report;
            						
            SELECT ayam, pakan FROM kandang."rows" WHERE id_rows = ${req.params.id_rows};`

        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 
           
            var dataLaporan = results[0].rows
            var data2 = results[1].rows
            var response = {
                data: dataLaporan,
                ayam: data2[0].ayam,
                pakan: data2[0].pakan
            }
            res.status(200).send(response)
        })
    },
    editAyamPakanRows: (req, res) => {
        const sql = `UPDATE kandang."rows" SET ayam = '${req.body.ayam}', pakan = '${req.body.pakan}'
        WHERE id_rows = ${req.body.id_rows};`
       
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 
          
            res.status(200).send({ message: "Edit Ayam Pakan Success" })
        })
    }
}