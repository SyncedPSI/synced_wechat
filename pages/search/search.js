//index.js
//获取应用实例
var app = getApp()
var WxSearch = require('../../lib/wxSearch/wxSearch.js')

var getData = function(self, isAdd=true) {
  const pageInfo = self.data.articles.pageInfo;
  if (!pageInfo.hasNextPage) return;

  wx.request({
    url: "https://easy-mock.com/mock/59a799074006183e48edf7e8/example/upload",
    method: "POST",
    data: {
      operationName: "ArticleList",
      query: `query ArticleList($count: Int, $cursor: String, $withContent: Boolean!, $withCategories: Boolean!, $exclude_banners: Boolean) {
                  articles(first: $count, after: $cursor, exclude_banners: $exclude_banners) {
                    edges {
                      node {
                        ...ArticleInfo
                        __typename
                      }
                      __typename
                    }
                    pageInfo {
                      ...PageInfo
                      __typename
                    }
                    __typename
                  }
                }

                fragment ArticleInfo on Article {
                  id
                  author {
                    id
                    name
                    __typename
                  }
                  categories @include(if: $withCategories) {
                    title
                    path
                    __typename
                  }
                  cover_image_url
                  description
                  published_at
                  content @include(if: $withContent)
                  title
                  path
                  __typename
                }

                fragment PageInfo on PageInfo {
                  endCursor
                  hasNextPage
                  __typename
                }
                `,
      variables: {
        cursor: "",
        count: 8,
        cursor: self.data.articles.pageInfo.endCursor,
        exclude_banners: true,
        withCategories: true,
        withContent: false
      }
    },
    // header: {
    //   'content-type': 'application/json'
    // },
    success: function (res) {
      let articles = res.data.data.articles;
      if (isAdd) {
        articles.edges = articles.edges.concat(self.data.articles.edges);
      }

      self.setData({ articles: articles })
      wx.stopPullDownRefresh();
    },
    fail: function (err) {
      console.log(err)
    }
  })
}
Page({
  data: {
    
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    WxSearch.init(that, 43, ['weappdev', '小程序', 'wxParse', 'wxSearch', 'wxNotification']);
    WxSearch.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);
  },

  onShow: function () {
    // getData(this);
  },
  wxSearchFn: function (e) {
    var that = this;
    // 展示搜索结果
    console.log("结果",e)
    WxSearch.wxSearchAddHisKey(that);
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
