const express = require('express')
const { gudangController } = require('../controller')
const { authentication } = require('../helper/middleware/auth')

const router = express.Router()


router.get('/get-gudang-location', authentication, gudangController.getGudangLocation)
router.post('/add-gudang', authentication, gudangController.addGudang)
router.post('/get-data-item', authentication, gudangController.getDataItem)

module.exports = router