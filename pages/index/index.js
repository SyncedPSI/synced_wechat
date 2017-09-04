//index.js
//获取应用实例
var app = getApp()
var getData = function(self, hasPost=false, isAdd=true) {
  const pageInfo = self.data.articles.pageInfo;
  if (!pageInfo.hasNextPage) return;

  wx.request({
    url: "https://jiqizhixin.com/graphql",
    method: "POST",
    data: {
      operationName: "ArticleList",
      query: `query ArticleList($count: Int, $cursor: String, $withContent: Boolean!, $withCategories: Boolean!, $exclude_banners: Boolean) {
                  articles(first: $count, after: $cursor, exclude_banners: $exclude_banners) {
                    edges {
                      node {
                        ...ArticleInfo
                      }
                    }
                    pageInfo {
                      endCursor
                      hasNextPage
                    }
                  }
                }

                fragment ArticleInfo on Article {
                  id
                  author {
                    id
                    name
                  }
                  categories @include(if: $withCategories) {
                    title
                    path
                  }
                  cover_image_url
                  description
                  published_at
                  content @include(if: $withContent)
                  title
                  path
                }
                `,
      variables: {
        count: 8,
        cursor: isAdd ? self.data.articles.pageInfo.endCursor : '',
        exclude_banners: true,
        withCategories: true,
        withContent: false
      }
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      let articles = res.data.data.articles;
      if (isAdd) {
        articles.edges = articles.edges.concat(self.data.articles.edges);
      }

      self.setData({ articles: articles });
      wx.stopPullDownRefresh();
    },
    fail: function (err) {
      console.log(err)
    }
  })
}
Page({
  data: {
    articlePost: {
      title: '深度学习必备课程',
      tag: ['深度', '学习'],
      author: '路雪',
      img: './article.jpg'
    },
    articles: {
      edges: [],
      pageInfo: {
        endCursor: '',
        hasNextPage: true
      }
    },
    userInfo: {}
  },

  onLoad: function () {
    var self = this;
    app.getUserInfo(function (userInfo) {
      self.setData({
        userInfo: userInfo
      })
    }); 
    // wx.getSystemInfo({
    //   success: function (res) {
    //     self.setData({
    //       scrollHeight: res.windowHeight
    //     });
    //   }
    // });
  },
  onShow: function () {
    getData(this);
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    getData(this,true, false);
  },

  onReachBottom: function() {
    getData(this);
  }
})
