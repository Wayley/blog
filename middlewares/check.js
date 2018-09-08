module.exports = {
  checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录')
      return res.redirect('/signin');// 跳转到登录页
    }
    next()
  },
  checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已经登录')
      return res.redirect('back');// 返回之前的页面
    }
    next()
  }
}
