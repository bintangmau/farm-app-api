const express = require('express')
const { kandangController } = require('../controller')
const { authentication } = require('../helper/middleware/auth')

const router = express.Router()

router.get('/get-data-location', authentication, kandangController.getDataLocation)

module.exports = router