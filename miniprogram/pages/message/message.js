const SQL = require("../../utils/SQL.js");
var app = getApp();

Page({
  data: {
    // text:"这是一个页面"
    focus: false,
    isShowView: true,
    messages: [],
  },
  bindtap: function (event) {
    wx.navigateTo({
      url: "search/search"
    })
  },
  bindfocus: function () {
    this.setData({
      focus: true
    })
    this.setData({
      isShowView: false
    })
  },
  bindblur: function () {

    this.setData({
      focus: false
    })
    this.setData({
      isShowView: true
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);

    var that = this;

    //查询所有的消息
    SQL.query('message', {}, function (res) {
      console.log(res);

      for (var i = 0; i < res.data.length; i++) {
        var message = {
          id: res.data[i]._id,
          title: res.data[i].title,
          message: res.data[i].message,
          time: res.data[i].time,
          url: "/static/images/icon/icon1.png",
        }
        that.data.messages.push(message);
      }

      that.setData({
        messages: that.data.messages
      })
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    var that = this;

    //查询所有的消息
    SQL.query('message', {}, function (res) {
      console.log(res);
      that.setData({
        messages: [],
      });
      
      for (var i = 0; i < res.data.length; i++) {
        var message = {
          id: res.data[i]._id,
          title: res.data[i].title,
          message: res.data[i].message,
          time: res.data[i].time,
          url: "/static/images/icon/icon1.png",
        }
        that.data.messages.push(message);
      }

      that.setData({
        messages: that.data.messages
      });
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();

    })
  },
})