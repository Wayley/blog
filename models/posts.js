const marked = require('marked');
const Post = require('../lib/mongo').Post;

const CommentModel = require('./comments');
// 将post的content从markdown 转换成html
Post.plugin('contentToHtml', {
  afterFind(posts) {
    return posts.map((post, index) => {
      post.content = marked(post.content);
      return post;
    });
  },
  afterFindOne(post) {
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  }
});

// 给post添加留言数 commentsCount
Post.plugin('addCommentsCount', {
  afterFind(posts) {
    return Promise.all(
      posts.map((post, index) => {
        return CommentModel.getCommentsCount(post._id).then(commentsCount => {
          post.commentsCount = commentsCount;
          return post;
        });
      })
    );
  },
  afterFindOne(post) {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then(count => {
        post.commentsCount = count;
        return post;
      });
    }
    return post;
  }
});

module.exports = {
  // 创建文章
  create(post) {
    return Post.create(post).exec();
  },
  // 通过文章id获取文章
  getPostById(_id) {
    // populate 建立关联表
    return Post.findOne({ _id })
      .populate({ path: 'author', model: 'User' })
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec();
  },
  // 获取全部文章或指定用户的所有文章
  getPosts(author) {
    const query = {};
    if (author) {
      query.author = author;
    }
    return Post.find(query)
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: -1 }) // 按创建时间降序
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec();
  },
  // 通过文章id给文章pv加1
  incPv(_id) {
    return Post.update({ _id }, { $inc: { pv: 1 } }).exec();
  },
  // 通过文章id获取一篇原生文章(编辑文章)
  getRawPostById(_id) {
    return Post.findOne({ _id })
      .populate({ path: 'author', model: 'User' })
      .exec();
  },
  // 通过文章id更新一篇文章
  updatePostById(_id, data) {
    return Post.update({ _id }, { $set: data }).exec();
  },
  // 通过文章id删除一篇文章
  // delPostById(_id) {
  //   return Post.deleteOne({ _id }).exec();
  // }
  delPostById(_id, author) {
    return Post.deleteOne({ _id, author })
      .exec()
      .then(result => {
        // 文章删除完成后删除该文章下的所有留言
        if (result.result.ok && result.result.n > 0) {
          return CommentModel.delCommentsById(_id);
        }
      });
  }
};
