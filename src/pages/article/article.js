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
    article: {}
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
  }
})
