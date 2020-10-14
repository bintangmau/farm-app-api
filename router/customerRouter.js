const express = require('express')
const { customerController } = require('../controller')
const { authentication } = require('../helper/middleware/auth')

const router = express.Router()

router.post('/add-new-customer', authentication, customerController.addNewCustomer)
router.get('/get-data-customer', authentication, customerController.getDataCustomer)
router.post('/searc-customer', authentication, customerController.searchCustomer)

module.exports = router