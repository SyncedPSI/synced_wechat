var app = getApp()
var WxSearch = require('../../lib/wxSearch/wxSearch.js')

var getData = function (self) {
  const pageInfo = self.data.articles.pageInfo;
  if (!self.data.has_more) { 
    return;
  };

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
        cursor: self.data.articles.pageInfo.endCursor,
        keywords: self.options.keywords
      }
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      let articles = res.data.data.elastic_search;
      articles.edges = self.data.articles.edges.concat(articles.edges);
      self.setData({ articles: articles });

      if (!self.data.articles.pageInfo.hasNextPage) {
        self.setData({ has_more: false });
      }

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
    isNotNode: true,
    has_more: true
  },

  onLoad: function () {
    getData(this);
  },
  onReachBottom: function () {
    getData(this);
  }
})
