//index.js
//获取应用实例
var app = getApp()
var WxParse = require('../../lib/wxParse/wxParse.js')

var getData = function(self, isAdd=true) {
  wx.request({
    url: "https://jiqizhixin.com/graphql",
    method: "POST",
    data: {
      operationName: "ArticleData",
      query: `query ArticleData (
                $id: ID!,
              ) {
                article: node(id: $id) {
                  id
                  ...on Article {
                    author {
                      id
                      name
                    }
                    content
                    published_at
                    title
                  }
                }
              }
              `,
      variables: {
        id: self.options.id
      }
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      const article = res.data.data.article;
      self.setData({ article: article });
      WxParse.wxParse('article_content', 'html', self.data.article.content, self, 5);

    },
    fail: function (err) {
      console.log(err)
    }
  })
}
Page({
  data: {
    article: {},
    comment_focus: false,
    comment: {
      has_more: false,
      total: 1,
      list: [
        { 
          id: 1,
          name: 'wukong',
          published_at: '2017年7月30日',
          content: '这篇文章很好很好很好很好',
          res: [
            { 
              id: 2,
              name: 'wukong',
              published_at: '2017年7月30日',
              content: '这是一条回复',
            },
            {
              id: 3,
              name: 'wukong',
              published_at: '2017年7月30日',
              content: '这是一条回复',
            }
          ]
        }
      ]
    },
    isLike: false,
    likeCount: 2000
  },

  onLoad: function () {
    var self = this;
    app.getUserInfo(function (userInfo) {
      self.setData({
        userInfo: userInfo
      })
    });
  },

  onShow: function () {
    getData(this);
  },

  likeTap: function () {
    const count = this.data.likeCount;

    if (this.data.isLike) {
      // 发送请求
      this.setData({ isLike: false });
      this.setData({ likeCount: count - 1 });
    } else {
      // 发送请求
      this.setData({ isLike: true });
      this.setData({ likeCount: count + 1 });
    }
  },

  onShareAppMessage: function (res) {
    const self = this; 

    // 来自页面内转发按钮
    if (res.from === 'button') {
      console.log(res.target)
    }

    return {
      title: self.data.article.title,
      path: `/page/article?id=${self.options.id}`,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  inputFocus: function() {
    this.setData({ comment_focus: true });
  },

  inputClose: function() {
    this.setData({ comment_focus: false });
  },
  submitComment : function(e) {
    // 提交评论
    console.log("comment content", e.detail.value.input);
    this.setData({ 
      comment_focus: false,
      comment_value: ''
    });
  }
})
