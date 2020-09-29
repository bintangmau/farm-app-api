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
                '${okg.toFixed(2)}', '${fcr.toFixed(2)}', '${ekor}', '${pakan}', NOW());
                
            UPDATE kandang."rows" SET ayam = '${sisaEkor}', presentase = '${presentase}', fcr = '${fcr.toFixed(2)}' WHERE id_rows = ${data.id_rows};`
 
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            const sqlGet = `SELECT * FROM kandang.days_record_report WHERE fid_rows = ${data.id_rows} ORDER BY id_record_report;
                        SELECT * FROM kandang."rows" WHERE fid_unit = ${data.id_unit} ORDER BY id_rows;
                        
                        SELECT * FROM kandang.unit WHERE fid_location = ${data.id_location} ORDER BY id_unit;
                        SELECT * FROM kandang."location" WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_location;
                        
                        SELECT COUNT(*) FROM kandang.days_record_report WHERE fid_rows = ${data.id_rows};
                        SELECT COUNT(*) FROM kandang."rows" WHERE fid_unit = ${data.id_unit};
                        SELECT COUNT(*) FROM kandang.unit WHERE fid_location = ${data.id_location};
                        SELECT COUNT(*) FROM kandang."location" WHERE fid_owner = ${req.logedUser.id_owner};`
        
            db.query(sqlGet, (err, resultsGet) => {
                if(err) {
                    res.status(500).send(err)
                } 
                var reports = resultsGet[0].rows
                // var rows = resultsGet[1].rows
                // var kandang = resultsGet[2].rows
                var location = resultsGet[3].rows
                var reportCount = resultsGet[4].rows[0].count
                // var rowCount = resultsGet[5].rows[0].count
                // var kandangCount = resultsGet[6].rows[0].count
                var locationCount = resultsGet[7].rows[0].count
    
                var reportJumlahButir = 0
                var reportKg = 0
                var reportTray = 0
                var reportTara = 0
                var reportNetto = 0
                var reportMatiAfkir = 0
                var reportSisaEkor = 0
                var reportPresentase = 0
                var report100Kg = 0
                var reportFcr = 0
    
                // TOTAL TO ROWS
                reports.forEach(e => {
                    reportJumlahButir += Number(e.jumlah_butir)
                    reportKg += Number(e.kg)
                    reportTray += Number(e.tray)
                    reportTara += Number(e.tara)
                    reportNetto += Number(e.netto)
                    reportMatiAfkir += Number(e.mati_afkir)
                    reportPresentase += Number(e.presentase)
                    report100Kg += Number(e['100/kg'])
                    reportFcr += Number(e.fcr)
                });
    
                reportPresentase = reportPresentase/reportCount
                report100Kg = report100Kg/reportCount
                reportFcr = reportFcr/reportCount
                
                const sqlTotalRows = `UPDATE kandang."rows" SET 
                jumlah_butir = '${reportJumlahButir}', tray = '${reportTray}', kg = '${reportKg}', tara = '${reportTara.toFixed(2)}', netto = '${reportNetto.toFixed(2)}', mati_afkir = '${reportMatiAfkir}', 
                sisa_ekor = '${reportSisaEkor}', "100/kg" = ${report100Kg}, tanggal = NOW() WHERE id_rows = ${data.id_rows};`
         
                db.query(sqlTotalRows, (err, resultTotalRows) => {
                    if(err) {
                        res.status(500).send(err)
                    }

                    const sqlGetRows = `SELECT * FROM kandang."rows" WHERE fid_unit = ${data.id_unit} ORDER BY id_rows;
                                        SELECT COUNT(*) FROM kandang."rows" WHERE fid_unit = ${data.id_unit};`

                    db.query(sqlGetRows, (err, resultRows) => {
                        if(err) {
                            res.status(500).send(err)
                        }
                        // TOTAL KANDANG
                        var rows = resultRows[0].rows
                        var rowCount = resultRows[1].rows[0].count

                        var rowsJumlahButir = 0 
                        var rowsKg = 0
                        var rowsTray = 0
                        var rowsTara = 0
                        var rowsNetto = 0
                        var rowsMatiAfkir = 0
                        var rowsSisaEkor = 0
                        var rowsPresentase = 0
                        var rows100kg = 0
                        var rowsFcr = 0
                        var rowsPakan = 0
                        
                        rows.forEach(e => {
                            rowsJumlahButir += Number(e.jumlah_butir)
                            rowsKg += Number(e.kg)
                            rowsTray += Number(e.tray)
                            rowsTara += Number(e.tara)
                            rowsNetto += Number(e.netto)
                            rowsMatiAfkir += Number(e.mati_afkir)
                            rowsPresentase += Number(e.presentase)
                            rows100kg += Number(e['100/kg'])
                            rowsFcr += Number(e.fcr)
                            rowsPakan += Number(e.pakan)
                        })
                        rowsPresentase = rowsPresentase/rowCount
                        rows100kg = rows100kg.toFixed(2)/rowCount
                        rowsFcr = rowsFcr/rowCount
                        
                        const sqlTotalKandang = `UPDATE kandang."unit" SET 
                        jumlah_butir = '${rowsJumlahButir}', tray = '${rowsTray}', kg = '${rowsKg}', tara = '${rowsTara.toFixed(2)}', netto = '${rowsNetto.toFixed(2)}', mati_afkir = '${rowsMatiAfkir}', 
                        ayam = '${rowsSisaEkor}', presentase = '${rowsPresentase.toFixed(2)}', "100/kg" = ${rows100kg.toFixed(2)}, fcr = '${rowsFcr.toFixed(2)}', pakan = '${rowsPakan}', tanggal = NOW() WHERE id_unit = ${data.id_unit};`
                        
                        db.query(sqlTotalKandang, (err, resultTotalKandang) => {
                            if(err) {
                                res.status(500).send(err)
                            }

                            const sqlGetUnit = `SELECT * FROM kandang."unit" WHERE fid_location = ${data.id_location} ORDER BY id_unit;
                            SELECT COUNT(*) FROM kandang."unit" WHERE fid_location = ${data.id_location};`

                            db.query(sqlGetUnit, (err, resultUnit) => {
                                if(err) {
                                    res.status(500).send(err)
                                }

                                // TOTAL LOCATION
                                var unit = resultUnit[0].rows
                                var unitCount = resultUnit[1].rows[0].count
                                
                                var unitJumlahButir = 0 
                                var unitKg = 0
                                var unitTray = 0
                                var unitTara = 0
                                var unitNetto = 0
                                var unitMatiAfkir = 0
                                var unitSisaEkor = 0
                                var unitPresentase = 0
                                var unit100kg = 0
                                var unitFcr = 0
                                var unitPakan = 0
                                
                                unit.forEach(e => {
                                    unitJumlahButir += Number(e.jumlah_butir)
                                    unitKg += Number(e.kg)
                                    unitTray += Number(e.tray)
                                    unitTara += Number(e.tara)
                                    unitNetto += Number(e.netto)
                                    unitMatiAfkir += Number(e.mati_afkir)
                                    unitPresentase += Number(e.presentase)
                                    unit100kg += Number(e['100/kg'])
                                    unitFcr += Number(e.fcr)
                                    unitPakan += Number(e.pakan)
                                })
                                unitPresentase = unitPresentase/unitCount
                                unit100kg = unit100kg.toFixed(2)/unitCount
                                unitFcr = unitFcr/unitCount

                                const sqlTotalLocation = `UPDATE kandang."location" SET 
                                jumlah_butir = '${unitJumlahButir}', tray = '${unitTray}', kg = '${unitKg}', tara = '${unitTara.toFixed(2)}', netto = '${unitNetto.toFixed(2)}', mati_afkir = '${unitMatiAfkir}', 
                                ayam = '${unitSisaEkor}', presentase = '${unitPresentase.toFixed(2)}', "100/kg" = ${unit100kg.toFixed(2)}, fcr = '${unitFcr.toFixed(2)}', pakan = '${unitPakan}', tanggal = NOW() WHERE id_location = ${data.id_location};`

                                db.query(sqlTotalLocation, (err, resultTotalLocation) => {
                                    if(err) {
                                        res.status(500).send(err)
                                    }

                                    res.status(200).send({ message: 'Input Record Success' })
                                })
                            })
                        })
                    })
                })
            })
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
    },
    totalCount: (req, res) => {
        var data = req.body

        const sql = `SELECT * FROM kandang.days_record_report WHERE fid_rows = ${data.id_rows} ORDER BY id_record_report;
                    SELECT * FROM kandang."rows" WHERE fid_unit = ${data.id_unit} ORDER BY id_rows;
                    
                    SELECT * FROM kandang.unit WHERE fid_location = ${data.id_location} ORDER BY id_unit;
                    SELECT * FROM kandang."location" WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_location;
                    
                    SELECT COUNT(*) FROM kandang.days_record_report WHERE fid_rows = ${data.id_rows};
                    SELECT COUNT(*) FROM kandang."rows" WHERE fid_unit = ${data.id_unit};
                    SELECT COUNT(*) FROM kandang.unit WHERE fid_location = ${data.id_location};
                    SELECT COUNT(*) FROM kandang."location" WHERE fid_owner = ${req.logedUser.id_owner};`
    
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 
            var reports = results[0].rows
            var rows = results[1].rows
            var kandang = results[2].rows
            var location = results[3].rows
            var reportCount = results[4].rows[0].count
            var rowCount = results[5].rows[0].count
            var kandangCount = results[6].rows[0].count
            var locationCount = results[7].rows[0].count

            var reportJumlahButir = 0
            var reportKg = 0
            var reportTray = 0
            var reportTara = 0
            var reportNetto = 0
            var reportMatiAfkir = 0
            var reportSisaEkor = 0
            var reportPresentase = 0
            var report100Kg = 0
            var reportFcr = 0
            var reportTanggal = 0

            // TOTAL TO ROWS
            reports.forEach(e => {
                reportJumlahButir += Number(e.jumlah_butir)
                reportKg += Number(e.kg)
                reportTray += Number(e.tray)
                reportTara += Number(e.tara)
                reportNetto += Number(e.netto)
                reportMatiAfkir += Number(e.mati_afkir)
                reportPresentase += Number(e.presentase)
                report100Kg += Number(e['100/kg'])
                reportFcr += Number(e.fcr)
            });

            reportPresentase = reportPresentase/reportCount
            report100Kg = report100Kg/reportCount
            reportFcr = reportFcr/reportCount

            // console.log(reportJumlahButir, 'jumlah butir')
            // console.log(reportKg, 'kg')
            // console.log(reportTray, 'tray')
            // console.log(reportTara, 'tara')
            // console.log(reportNetto, 'netto')
            // console.log(reportMatiAfkir, 'matia afkir')
            // console.log(reportSisaEkor, 'sisa ekor')
            // console.log(reportPresentase.toFixed(2))
            // console.log(report100Kg.toFixed(2))
            // console.log(reportFcr.toFixed(2))
            // console.log(reportAyam, 'ayam')
            // console.log(reportPakan, 'pakan')

            // TOTAL IN KANDANG
            console.log(ro)

            res.status(200).send({ message: "get bisa"})
        })
    }
}