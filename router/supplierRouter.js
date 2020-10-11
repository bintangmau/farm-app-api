const express = require('express')
const { supplierController } = require('../controller')
const { authentication } = require('../helper/middleware/auth')

const router = express.Router()

router.post('/add-new-supplier', authentication, supplierController.addNewSupplier)
router.get('/get-data-supplier', authentication, supplierController.getDataSupplier)
router.post('/edit-data-supplier', authentication, supplierController.editSupplier)
router.post('/search-data-supplier', authentication, supplierController.searchDataSupplier)

module.exports = router