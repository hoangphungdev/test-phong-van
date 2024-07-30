const express = require('express')
const router = express.Router()

const { getHomePage, login } = require('../controllers/homeController')

// khai báo route
router.get('/', getHomePage)
router.post('/login', login)


module.exports = router;


