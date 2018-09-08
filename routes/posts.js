const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;

// GET /posts 用户的文章页面
router.get('/', function (req, res, next) {
  res.send('主页')
})

// GET /posts/create 发表文章页面
router.get('/create', checkLogin, function (req, res, next) {
  res.send('发表文章页面')
})

// POST /posts/create 发表文章
router.post('/create', checkLogin, function (req, res, next) {
  res.send('发表文章')
})

// GET /posts/:postId 文章详情页面
router.get('/:postId', function (req, res, next) {
  res.send('文章详情页面')
})

// GET /posts/:postId/edit 更新文章页面
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章页面')
})

// POST /posts/:postId/edit 更新文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章')
})

// GET /posts/:postId/remove 删除文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  res.send('删除文章')
})


module.exports = router