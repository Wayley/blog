const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;
const CommentModel = require('../models/comments');

// POST /comments 创建一条留言
router.post('/', checkLogin, function(req, res, next) {
  // res.send('创建一条留言');
  const author_id = req.session.user._id;
  const postId = req.fields.postId;
  const content = req.fields.content;

  // 参数校验
  try {
    if (!content.length) {
      throw new Error('请填写留言内容');
    }
  } catch (error) {
    req.flash('error', error.message);
    return res.redirect('back');
  }
  const comment = {
    author: author_id,
    postId,
    content
  };
  CommentModel.create(comment)
    .then(() => {
      req.flash('success', '留言成功');
      res.redirect('back');
    })
    .catch(next);
});
// GET　／comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, function(req, res, next) {
  // res.send('删除留言');
  const commentId = req.params.commentId;
  const author_id = req.session.user._id;

  CommentModel.getCommentById(commentId).then(comment => {
    if (!comment) {
      throw new Error('留言不存在');
    }
    if (author_id.toString() !== comment.author.toString()) {
      throw new Error('没用删除留言的权限');
    }
    CommentModel.delCommentById(commentId)
      .then(() => {
        req.flash('success', '删除留言成功');
        res.redirect('back');
      })
      .catch(next);
  });
});
module.exports = router;
