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
router.post('/check-out', authentication, barangController.checkOut)
router.get('/get-data-sales', authentication, barangController.getDataSales)
router.post('/edit-harga-telur', authentication, barangController.editHargaTelur)
router.post('/get-data-barang-by-supplier', authentication, barangController.getDataBarangBySupplier)
router.post('/plus-jumlah-barang', authentication, barangController.plusJumlahBarang)
router.delete('/delete-barang/:id', authentication, barangController.deleteBarang)

module.exports = router