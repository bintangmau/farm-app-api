const express = require('express')
const { kandangController } = require('../controller')
const { authentication } = require('../helper/middleware/auth')

const router = express.Router()

router.get('/get-data-location', authentication, kandangController.getDataLocation)
router.post('/add-location', authentication, kandangController.addLocation)
router.get('/get-data-kandang/:id_location', authentication, kandangController.getDataKandang)
router.post('/add-kandang', authentication, kandangController.addKandang)
router.post('/get-data-rows', authentication, kandangController.getDataRows)
router.post('/add-rows', authentication, kandangController.addRows)
router.post('/delete-location/:id_location', authentication, kandangController.deleteLocation)
router.post('/delete-unit/:id_unit', authentication, kandangController.deleteUnit)
router.post('/delete-rows/:id_rows', authentication, kandangController.deleteRows)

module.exports = router