var app = getApp()
var WxSearch = require('../../lib/wxSearch/wxSearch.js')

var getData = function (self, keywords, isAdd = true) {
  const pageInfo = self.data.articles.pageInfo;
  if (!pageInfo.hasNextPage) return;

  wx.request({
    url: "https://jiqizhixin.com/graphql",
    method: "POST",
    data: {
      operationName: "searchArticle",
      query: `query searchArticle (
                $keywords: String!,
                $count: Int,
                $cursor: String
              ) {
                elastic_search(first: $count, after: $cursor, keywords: $keywords, filter_tags: []) {
                  edges {
                    node {
                      id
                      cover_image_url
                      title
                      categories
                    }
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }
                `,
      variables: {
        count: 8,
        cursor: isAdd ? self.data.articles.pageInfo.endCursor : '',
        keywords
      }
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      let articles = res.data.data.elastic_search;
      if (isAdd) {
        articles.edges = self.data.articles.edges.concat(articles.edges);
      }

      self.setData({ articles: articles });
      wx.stopPullDownRefresh();
    },
    fail: function (err) {
      console.log(err);
    }
  })
}
Page({
  data: {
    articles: {
      edges: [],
      pageInfo: {
        endCursor: '',
        hasNextPage: true
      }
    },
    wxSearchData: {
      value: ''
    },
    isNotNode: true
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this;
    WxSearch.init(that, 42, ['weappdev', '小程序', 'wxParse', 'wxSearch', 'wxNotification']);
    WxSearch.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);
  },
  wxSearchFn: function (e) {
    var that = this;
    WxSearch.wxSearchAddHisKey(that);
    var keywords = that.data.wxSearchData.value;
    if (keywords && keywords !== '') {
      wx.navigateTo({
        url: `/pages/result/result?keywords=${keywords}`
      });
    }
  },
  wxSearchInput: function (e) {
    var that = this;
    // 发送请求
    // 显示相关词
    console.log("显示关键词")
    WxSearch.initMindKeys(['weappdev.com', 'aaa', 'aaaaa', 'aaaa']);
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this;
    console.log("输入框得到焦点")
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this;
    console.log("输入框失去焦点")
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this;
    console.log("keytap", e)
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this;
    console.log("删除某个历史")
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    console.log("删除全部历史")
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this;
    console.log("点击相关词");
    WxSearch.wxSearchHiddenPancel(that);
  }
})
