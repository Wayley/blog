const express = require('express');
const router = express.Router();

const PostModel = require('../models/posts');
const CommentModel = require('../models/comments');
const checkLogin = require('../middlewares/check').checkLogin;

// GET /posts 用户的文章页面
router.get('/', function(req, res, next) {
  // res.send('主页');
  const author = req.query.author;

  PostModel.getPosts(author)
    .then(posts => {
      res.render('posts', { posts });
    })
    .catch(next);
});

// GET /posts/create 发表文章页面
router.get('/create', checkLogin, function(req, res, next) {
  // res.send('发表文章页面');
  res.render('create');
});

// POST /posts/create 发表文章
router.post('/create', checkLogin, function(req, res, next) {
  // res.send('发表文章');
  const author = req.session.user._id;
  const title = req.fields['title'];
  const content = req.fields['content'];

  // 参数校验
  try {
    if (!title.length) {
      throw new Error('请填写标题!');
    }
    if (!content.length) {
      throw new Error('请填写内容!');
    }
  } catch (error) {
    req.flash('error', error.message);
    return res.redirect('back');
  }
  const post = { author, title, content };
  PostModel.create(post)
    .then(result => {
      const post_id = result.ops[0]._id;
      req.flash('success', '发表成功');
      res.redirect(`/posts/${post_id}`);
    })
    .catch(next);
});

// GET /posts/:postId 文章详情页面
router.get('/:postId', function(req, res, next) {
  // res.send('文章详情页面');
  const postId = req.params.postId;
  const postInfo = PostModel.getPostById(postId); // 获取文章信息
  const CommentInfo = CommentModel.getCommentsByPostId(postId); //获取该文章所有留言
  const incPv = PostModel.incPv(postId); // pv加1
  Promise.all([postInfo, CommentInfo, incPv])
    .then(list => {
      const post = list[0];
      const comments = list[1];
      if (!post) {
        throw new Error('该文章不存在');
      }
      res.render('post', { post, comments });
    })
    .catch(next);
});
// GET /posts/:postId/edit 更新文章页面
router.get('/:postId/edit', checkLogin, function(req, res, next) {
  // res.send('更新文章页面');
  const postId = req.params.postId;
  const author_id = req.session.user._id;

  PostModel.getPostById(postId)
    .then(post => {
      if (!post) {
        throw new Error('该文章不存在');
      }
      if (author_id.toString() !== post.author._id.toString()) {
        throw new Error('权限不足');
      }
      res.render('edit', { post });
    })
    .catch(next);
});

// POST /posts/:postId/edit 更新文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
  // res.send('更新文章');
  const author_id = req.session.user._id;
  const postId = req.params.postId;
  const title = req.fields.title;
  const content = req.fields.content;
  // 参数校验
  try {
    if (!title.length) {
      throw new Error('请填写标题');
    }
    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch (error) {
    req.flash('error', error.message);
    return res.redirect('back');
  }
  // 先查询
  PostModel.getRawPostById(postId).then(post => {
    if (!post) {
      throw new Error('该文章不存在');
    }
    if (author_id.toString() !== post.author._id.toString()) {
      throw new Error('权限不足');
    }
    // 更新
    const data = { title, content };
    PostModel.updatePostById(postId, data)
      .then(() => {
        req.flash('succes', '更新文章成功');
        res.redirect(`/posts/${postId}`);
      })
      .catch(next);
  });
});

// GET /posts/:postId/remove 删除文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
  // res.send('删除文章');
  const author_id = req.session.user._id;
  const postId = req.params.postId;
  // 先查询
  PostModel.getRawPostById(postId).then(post => {
    if (!post) {
      throw new Error('文章不存在');
    }
    if (author_id.toString() !== post.author._id.toString()) {
      throw new Error('权限不足');
    }
    PostModel.delPostById(postId)
      .then(() => {
        req.flash('success', '删除文章成功');
        res.redirect('/posts');
      })
      .catch(next);
  });
});

module.exports = router;
