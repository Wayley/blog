const User = require('../lib/mongo').User

module.exports = {
  // 注册用户
  create(user) {
    return User.create(user).exec()
  }
}