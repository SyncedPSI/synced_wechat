//logs.js
var app = getApp()

Page({
  data: {
    userInfo: {},
    motto: 'Hello World'
  },
  onLoad: function () {
    wx.stopPullDownRefresh();
    var self = this;
    app.getUserInfo(function (userInfo) {
      self.setData({
        userInfo: userInfo
      })
    });
  }
})
