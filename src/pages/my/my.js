//logs.js
var app = getApp()

Page({
  data: {
    userInfo: {},
    motto: 'Hello World'
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    });
   
  }
})
