const express = require('express')
const { barangController } = require('../controller')
const { authentication } = require('../helper/middleware/auth')

const router = express.Router()

router.post('/add-new-barang', authentication, barangController.addNewBarang)

module.exports = router