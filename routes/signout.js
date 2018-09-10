const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;

// POST /signout 用户退出
router.get('/', checkLogin, function(req, res, next) {
  // res.send('用户退出');
  // 清除session中的用户数据信息
  req.session.user = null;
  req.flash('success', '已成功退出');
  // 退出后跳转到主页
  res.redirect('/posts');
});

module.exports = router;
