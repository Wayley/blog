const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin


// GET　／signin 登录页面
router.get('/', checkNotLogin, function (req, res, next) {
  res.send('登录页面')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  res.send('用户登录')
})

module.exports = router
