const express = require('express')
const { userController } = require('../controller')
const { authentication } = require('../helper/middleware/auth')

const router = express.Router()

router.post('/login-user', userController.loginUser)

module.exports = router