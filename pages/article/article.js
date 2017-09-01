//index.js
//获取应用实例
var app = getApp()
var WxParse = require('../../lib/wxParse/wxParse.js')

var getData = function(self, isAdd=true) {
  const pageInfo = self.data.articles.pageInfo;
  if (!pageInfo.hasNextPage) return;

  wx.request({
    url: "localhost:3000/graphiql",
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
    article: {
      content: `<p><br></p>
                <p>​机器翻译（MT）是借机器之力「自动地将一种自然语言文本（源语言）翻译成另一种自然语言文本（目标语言）」[1]。使用机器做翻译的思想最早由 Warren Weaver 于 1949 年提出。在很长一段时间里（20 世纪 50 年代到 80 年代），机器翻译                   都是通过研究源语言与目标语言的语言学信息来做的，也就是基于词典和语法生成翻译，这被称为基于规则的机器翻译（RBMT）。随着统计学的发展，研究者开始将统计模型应用于机器翻译，这种方法是基于对双语文本语料库的分析来生成翻译结果。这种方                   法被称为统计机器翻译（SMT），它的表现比 RBMT 更好，并且在 1980 年代到 2000 年代之间主宰了这一领域。1997 年，Ramon Neco 和 Mikel Forcada 提出了使用「编码器-解码器」结构做机器翻译的想法 [2]。几年之后的 2003 年，蒙特                    利尔大学 Yoshua Bengio 领导的一个研究团队开发了一个基于神经网络的语言模型 [3]，改善了传统 SMT 模型的数据稀疏性问题。他们的研究工作为未来神经网络在机器翻译上的应用奠定了基础。</p>
                <h3 style="text-align: center; ">神经机器翻译的诞生</h3>
                <p><br></p>
                <p>2013 年，Nal Kalchbrenner 和 Phil Blunsom 提出了一种用于机器翻译的新型端到端编码器-解码器结构 [4]。该模型可以使用卷积神经网络（CNN）将给定的一段源文本编码成一个连续的向量，然后再使用循环神经网络（RNN）作为解码器将该                  状态向量转换成目标语言。他们的研究成果可以说是神经机器翻译（NMT）的诞生；神经机器翻译是一种使用深度学习神经网络获取自然语言之间的映射关系的方法。NMT 的非线性映射不同于线性的 SMT 模型，而且是使用了连接编码器和解码器的状态向量来                   描述语义的等价关系。此外，RNN 应该还能得到无限长句子背后的信息，从而解决所谓的「长距离重新排序（long distance reordering）」问题 [29]。但是，「梯度爆炸/消失」问题 [28] 让 RNN 实际上难以处理长距依存（long distance                       dependency）；因此，NMT 模型一开始的表现并不好。</p>
                `
    }
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
    // getData(this);
    // 应该在getData中解析article.content
    WxParse.wxParse('article_content', 'html', this.data.article.content, this, 5);
  }
})
