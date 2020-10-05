const express = require('express')
const { supplierController } = require('../controller')
const { authentication } = require('../helper/middleware/auth')

const router = express.Router()

router.post('/add-new-supplier', authentication, supplierController.addNewSupplier)

module.exports = router