const marked = require('marked');
const Comment = require('../lib/mongo').Comment;

// 把comment的content从markdown转换成html
Comment.plugin('contentToHtml', {
  afterFind(comments) {
    return comments.map((comment, index) => {
      comment.content = marked(comment.content);
      return comment;
    });
  }
});

//
module.exports = {
  // 创建留言
  create(comment) {
    return Comment.create(comment).exec();
  },
  // 通过 留言id 获取留言详情
  getCommentById(_id) {
    return Comment.findOne({ _id }).exec();
  },
  // 通过 留言id 删除该留言
  delCommentById(_id) {
    return Comment.deleteOne({ _id }).exec();
  },

  // 通过 文章id 获取该文章下所有留言,按留言创建时间升序
  getCommentsByPostId(postId) {
    return Comment.find({ postId })
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: 1 })
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },
  // 通过 文章id 获取该文章留言总数
  getCommentsCount(postId) {
    return Comment.count({ postId }).exec();
  },
  // 通过 文章id 删除该文章下的所有留言
  delCommentsById(postId) {
    return Comment.deleteMany({ postId }).exec();
  }
};
