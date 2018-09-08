const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// POST /signout 用户退出
router.get('/', checkLogin, function (req, res, next) {
  res.send('用户退出')
})

module.exports = router

