const express = require('express')
const { barangController } = require('../controller')
const { getCountInToko } = require('../controller/barangController')
const { authentication } = require('../helper/middleware/auth')

const router = express.Router()

router.post('/add-new-barang', authentication, barangController.addNewBarang)
router.get('/get-data-barang', authentication, barangController.getDataBarang)
router.get('/get-list-supplier', authentication, barangController.getListSupplier)
router.post('/edit-data-barang', authentication, barangController.editDataBarang)
router.post('/search-data-barang', authentication, barangController.searchDataBarang)
router.get('/count-in-toko', authentication, getCountInToko)

module.exports = router