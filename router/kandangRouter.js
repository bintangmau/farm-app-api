const express = require('express')
const { kandangController } = require('../controller')
const { authentication } = require('../helper/middleware/auth')

const router = express.Router()

router.get('/get-data-location', authentication,  kandangController.getDataLocation)
router.post('/add-location', authentication, kandangController.addLocation)
router.get('/get-data-kandang/:id_location', authentication, kandangController.getDataKandang)
router.post('/add-kandang', authentication, kandangController.addKandang)
router.post('/get-data-rows', authentication, kandangController.getDataRows)
router.post('/add-rows', authentication, kandangController.addRows)
router.post('/delete-location/:id_location', authentication, kandangController.deleteLocation)
router.post('/delete-unit/:id_unit', authentication, kandangController.deleteUnit)
router.post('/delete-rows/:id_rows', authentication, kandangController.deleteRows)
router.post('/add-days-record-report', authentication, kandangController.addDaysRecordReport)
router.get('/get-days-record-report/:id_rows', authentication, kandangController.getDaysRecordReport)
router.post('/edit-ayam-pakan-rows', authentication, kandangController.editAyamPakan2)
router.get('/get-data-owner-kandang', authentication, kandangController.getDataOwnerKandang)
router.post('/filter-record-by-date', authentication, kandangController.filterRecordByDate)
router.post('/search-data-location', authentication, kandangController.searchDataLocation)

module.exports = router