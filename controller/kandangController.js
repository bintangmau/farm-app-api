const { db } = require('../helper/database')

module.exports = {
    getDataLocation: (req, res) => {
        const sql = `SELECT * FROM kandang."location" WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_location;`
        
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
        const sql = `SELECT * 
                FROM kandang.unit 
                WHERE fid_owner = ${req.logedUser.id_owner} AND fid_location = ${req.params.id_location}
                ORDER BY id_unit;

                SELECT location_name FROM kandang."location" WHERE id_location = ${req.params.id_location};`
    
            db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 
            var data = results[0].rows
            var locationName = results[1].rows[0].location_name
            
            const response = {
                data,
                locationName
            }

            res.status(200).send(response)
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
        const sql = `SELECT * FROM kandang."rows" WHERE fid_owner = ${req.logedUser.id_owner} AND fid_location = ${req.body.id_location} AND fid_unit = ${req.body.id_unit} 
        ORDER BY id_rows;
        
        SELECT location_name FROM kandang."location" WHERE id_location = ${req.body.id_location};
        
        SELECT unit_name FROM kandang."unit" WHERE id_unit = ${req.body.id_unit}`
       
        db.query(sql, (err, results) => {
            if(err) {
                res.status(500).send(err)
            } 

            var data = results[0].rows
            var locationName = results[1].rows[0].location_name
            var unitName = results[2].rows[0].unit_name

            const response = {
                data,
                locationName,
                unitName
            }

            res.status(200).send(response)
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
                       
                        
                        SELECT COUNT(*) FROM kandang.days_record_report WHERE fid_rows = ${data.id_rows};`
        
            db.query(sqlGet, (err, resultsGet) => {
                if(err) {
                    res.status(500).send(err)
                } 

                var reports = resultsGet[0].rows
                var reportCount = resultsGet[1].rows[0].count
                
                var reportJumlahButir = 0
                var reportKg = 0
                var reportTray = 0
                var reportTara = 0
                var reportNetto = 0
                var reportMatiAfkir = 0
                var reportSisaEkor = ekor
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
                    reportSisaEkor += Number(e.ayam)
                });
    
                reportPresentase = reportPresentase/reportCount
                report100Kg = report100Kg/reportCount
                reportFcr = reportFcr/reportCount

                const sqlTotalRows = `UPDATE kandang."rows" SET 
                jumlah_butir = '${reportJumlahButir}', tray = '${reportTray}', kg = '${reportKg.toFixed(2)}', tara = '${reportTara.toFixed(2)}', netto = '${reportNetto.toFixed(2)}', mati_afkir = '${reportMatiAfkir}', 
                sisa_ekor = '${reportSisaEkor}', "100/kg" = ${report100Kg.toFixed(2)}, tanggal = NOW() WHERE id_rows = ${data.id_rows};`
         
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
                            rowsSisaEkor += Number(e.ayam)
                            rowsPresentase += Number(e.presentase)
                            rows100kg += Number(e['100/kg'])
                            rowsFcr += Number(e.fcr)
                            rowsPakan += Number(e.pakan)
                        })
                        rowsPresentase = rowsPresentase/rowCount
                        rows100kg = rows100kg.toFixed(2)/rowCount
                        rowsFcr = rowsFcr/rowCount

                        const sqlTotalKandang = `UPDATE kandang."unit" SET 
                        jumlah_butir = '${rowsJumlahButir}', tray = '${rowsTray}', kg = '${rowsKg.toFixed(2)}', tara = '${rowsTara.toFixed(2)}', netto = '${rowsNetto.toFixed(2)}', mati_afkir = '${rowsMatiAfkir}', 
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
                                    unitSisaEkor += Number(e.ayam)
                                    unitPresentase += Number(e.presentase)
                                    unit100kg += Number(e['100/kg'])
                                    unitFcr += Number(e.fcr)
                                    unitPakan += Number(e.pakan)
                                })
                                unitPresentase = unitPresentase/unitCount
                                unit100kg = unit100kg.toFixed(2)/unitCount
                                unitFcr = unitFcr/unitCount

                                const sqlTotalLocation = `UPDATE kandang."location" SET 
                                jumlah_butir = '${unitJumlahButir}', tray = '${unitTray}', kg = '${unitKg.toFixed(2)}', tara = '${unitTara.toFixed(2)}', netto = '${unitNetto.toFixed(2)}', mati_afkir = '${unitMatiAfkir}', 
                                ayam = '${unitSisaEkor}', presentase = '${unitPresentase.toFixed(2)}', "100/kg" = ${unit100kg.toFixed(2)}, fcr = '${unitFcr.toFixed(2)}', pakan = '${unitPakan}', tanggal = NOW() WHERE id_location = ${data.id_location};`

                                db.query(sqlTotalLocation, (err, resultTotalLocation) => {
                                    if(err) {
                                        res.status(500).send(err)
                                    }

                                    const sqlGetLocation = `SELECT * FROM kandang."location" WHERE fid_owner = ${req.logedUser.id_owner} ORDER BY id_location;
                                    SELECT COUNT(*) FROM kandang."location" WHERE fid_owner = ${req.logedUser.id_owner};`

                                    db.query(sqlGetLocation, (err, resultLocation) => {
                                        if(err) {
                                            res.status(500).send(err)
                                        }
            
                                        var location = resultLocation[0].rows 
                                        var locationCount = resultLocation[1].rows[0].count

                                        var locationJumlahButir = 0 
                                        var locationKg = 0
                                        var locationTray = 0
                                        var locationTara = 0
                                        var locationNetto = 0
                                        var locationMatiAfkir = 0
                                        var locationSisaEkor = 0
                                        var locationPresentase = 0
                                        var location100kg = 0
                                        var locationFcr = 0
                                        var locationPakan = 0
                                        
                                        location.forEach(e => {
                                            locationJumlahButir += Number(e.jumlah_butir)
                                            locationKg += Number(e.kg)
                                            locationTray += Number(e.tray)
                                            locationTara += Number(e.tara)
                                            locationNetto += Number(e.netto)
                                            locationMatiAfkir += Number(e.mati_afkir)
                                            locationPresentase += Number(e.presentase)
                                            location100kg += Number(e['100/kg'])
                                            locationFcr += Number(e.fcr)
                                            locationPakan += Number(e.pakan)
                                            locationSisaEkor += Number(e.ayam)
                                        })
                                        locationPresentase = locationPresentase/rowCount
                                        location100kg = location100kg.toFixed(2)/rowCount
                                        locationFcr = locationFcr/rowCount

                                        const sqlTotalOwner = `UPDATE "humanResource"."owner" SET 
                                        jumlah_butir = '${locationJumlahButir}', tray = '${locationTray}', kg = '${locationKg.toFixed(2)}', tara = '${locationTara.toFixed(2)}', netto = '${locationNetto.toFixed(2)}', 
                                        mati_afkir = '${locationMatiAfkir}', ayam = '${locationSisaEkor}', presentase = '${locationPresentase.toFixed(2)}', 
                                        "100/kg" = ${location100kg.toFixed(2)}, fcr = '${locationFcr.toFixed(2)}', pakan = '${locationPakan}', 
                                        tanggal = NOW() WHERE id_owner = ${req.logedUser.id_owner};`
                                        
                                        db.query(sqlTotalOwner, (err, resultTotalOwner) => {
                                            if(err) {
                                                console.log(err)
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
    editAyamPakan2: (req, res) => {
        const sqlGetDataRowsOld = `SELECT ayam, pakan FROM kandang."rows" WHERE id_rows = ${req.body.id_rows};`

        db.query(sqlGetDataRowsOld, (err, resultOldRows) => {
            if(err) {
                res.status(500).send(err)
            }
            
            var oldRowsAyam = Number(resultOldRows.rows[0].ayam)
            var oldRowsPakan = Number(resultOldRows.rows[0].pakan)

                const sqlEditRows = `UPDATE kandang."rows" SET ayam = '${req.body.ayam}', pakan = '${req.body.pakan}'
                WHERE id_rows = ${req.body.id_rows};`

                db.query(sqlEditRows, (err, results) => {
                    if(err) {
                    res.status(500).send(err)
                }
                    
                const sqlGetUnit = `SELECT ayam, pakan FROM kandang.unit WHERE id_unit = ${req.body.id_unit};`
                
                db.query(sqlGetUnit, (err, resultUnit) => {
                    if(err) {
                        res.status(500).send(err)
                    }
                    var ayam = Number(req.body.ayam)
                    var pakan = Number(req.body.pakan)
                    var ayamUnit = Number(resultUnit.rows[0].ayam)
                    var pakanUnit = Number(resultUnit.rows[0].pakan)
                    
                    if(ayamUnit === 0) {
                        ayamUnit = ayam
                    } else if(ayamUnit > 0 ) {``
                        ayamUnit = (ayamUnit - oldRowsAyam) + ayam
                    }
                    if(pakanUnit === 0) {
                        pakanUnit = pakan
                    } else if(pakanUnit > 0) {
                        pakanUnit = (pakanUnit - oldRowsPakan) + pakan
                    }

                    const sqlEditUnit = `UPDATE kandang."unit" SET ayam = '${ayamUnit}', pakan = '${pakanUnit}'
                    WHERE id_unit = ${req.body.id_unit};`
                    
                    db.query(sqlEditUnit, (err, resultEditUnit) => {
                        if(err) {
                            res.status(500).send(err)
                        }

                        const sqlGetDataUnitOld = `SELECT ayam, pakan FROM kandang."unit" WHERE fid_location = ${req.body.id_location}`

                        db.query(sqlGetDataUnitOld, (err, resultUnitOld) => {
                            if(err) {
                                res.status(500).send(err)
                            }
                            var totalUnitAyamToLoc = 0
                            var totalUnitPakanToLoc = 0
                            var resultDataUnit = resultUnitOld.rows

                            resultDataUnit.forEach(e => {
                                totalUnitAyamToLoc += Number(e.ayam)
                                totalUnitPakanToLoc += Number(e.pakan)
                            })

                            const sqlEditLocation = `UPDATE kandang."location" SET ayam = '${totalUnitAyamToLoc}', pakan = '${totalUnitPakanToLoc}'
                            WHERE id_location = ${req.body.id_location};`

                            db.query(sqlEditLocation, (err, resultEditLoc) => {
                                if(err) {
                                    res.status(500).send(err)
                                }

                                const sqlGetDataLocation = `SELECT ayam, pakan FROM kandang."location" WHERE fid_owner = ${req.logedUser.id_owner}`

                                db.query(sqlGetDataLocation, (err, resultDataLoc) => {
                                    if(err) {
                                        res.status(500).send(err)
                                    }

                                    var dataLoc = resultDataLoc.rows
                                    var totalAyamLoc = 0
                                    var totalPakanLoc = 0
                                    
                                    dataLoc.forEach(e => {
                                        totalAyamLoc += Number(e.ayam)
                                        totalPakanLoc += Number(e.pakan)
                                    })

                                    const editOwnerAyamPakan = `UPDATE "humanResource"."owner" SET ayam = '${totalAyamLoc}', pakan = '${totalPakanLoc}'
                                    WHERE id_owner = ${req.logedUser.id_owner};`

                                    db.query(editOwnerAyamPakan, (err, resultEditOwner) => {
                                        if(err) {
                                            res.status(500).send(err)
                                        }
                                        
                                        res.status(200).send({ message: "edit ayam pakan success"})
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }
}