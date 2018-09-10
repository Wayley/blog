const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

const UserModel = require('../models/users');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET　／signin 登录页面
router.get('/', checkNotLogin, function(req, res, next) {
  // res.send('登录页面');
  res.render('signin');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
  // res.send('用户登录');
  const name = req.fields['name'];
  const password = req.fields['password'];
  console.log(name);

  // 参数校验
  try {
    if (!name.length) {
      throw new Error('请填写用户名');
    }
    if (!password.length) {
      throw new Error('请填写密码');
    }
  } catch (error) {
    req.flash('error', error.message);
    return res.redirect('back');
  }
  // 查询数据
  UserModel.getUserByName(name)
    .then(user => {
      // 校验是否注册
      if (!user) {
        req.flash('error', '用户未注册');
        return res.redirect('back');
      }
      // 校验密码
      if (sha1(password) !== user.password) {
        req.flash('error', '用户名或密码错误');
        return res.redirect('back');
      }

      req.flash('success', '登录成功');
      // 用户信息写入session
      delete user.password;
      req.session.user = user;
      //
      res.redirect('/posts');
    })
    .catch(next);
});

module.exports = router;
