// pages/course/course.js
const SQL = require("../../utils/SQL.js");
const app = getApp()
const FCC = require("../../utils/FCC.js");
var iconPath = "/static/icons/"
var tabs = [
  {
    "icon": iconPath + "mark.png",
    "iconActive": iconPath + "markHL.png",
    "title": "签到",
    "extraStyle": "",
  },
  {
    "icon": iconPath + "collect.png",
    "iconActive": iconPath + "collectHL.png",
    "title": "题库",
    "extraStyle": "",
  },
  {
    "icon": iconPath + "like.png",
    "iconActive": iconPath + "likeHL.png",
    "title": "互动",
    "extraStyle": "",
  },
  {
    "icon": iconPath + "more.png",
    "iconActive": iconPath + "moreHL.png",
    "title": "设置",
    "extraStyle": "border:none;",
  },
]


Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId: '',//////gai   XFsXhgGicn9ybupV
    tabs: tabs,
    // 当前选中的标签
    currentTab: "tab1",
    headTab: 0,
    // 高亮的标签索引
    highLightIndex: "0",
    coursePoint: {},
    isSign: false,
    name: ""

  },
  signIn: function () {

    var that = this
    getLoc(that)


  },

  // 点击tab项事件
  touchTab: function (event) {
    var tabIndex = parseInt(event.currentTarget.id);
    var template = "tab" + (tabIndex + 1).toString();
    this.setData({
      currentTab: template,
      highLightIndex: tabIndex.toString()
    }
    );
  },
  onLoad: function (options) {
    // console.log(options)
    var that = this
    var isSigning = false
    if (options.isSigning == "true")
      isSigning = true

    that.setData({
      courseId: options.id,
      isSigning: isSigning,
      name: options.name
    })
    if (isSigning)
      SQL.query('course', { _id: options.id }, function (res) {
        that.setData({
          coursePoint: res.data[0].point,
        })
      })

  },

  //下拉刷新
  onPullDownRefresh: function (e) {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    SQL.query('course', { _id: options.id }, function (res) {
      that.setData({
        coursePoint: res.data[0].point,
      })
    })
    //模拟加载
    setTimeout(function (e) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    SQL.query('user', {
      _id: app.globalData.userDataBaseInfo._id
    }, function (res) {
      if (res.data[0].signIn.hasOwnProperty(that.data.courseId))
        that.setData({
          isSign: res.data[0].signIn[that.data.courseId]
        })
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})


//-----------------------


function getLoc(that) {
  if (that.data.coursePoint == {}) {
    wx.showModal({
      title: '提示',
      content: '签到信息获取失败：请尝试下拉刷新或检查网络',
    })
    return
  }

  //获取当前位置
  wx.getLocation({
    type: 'gcj02',// 默认为 wgs84 返回 gps 坐标，gcj02 返回可用wx.openLocation 的坐标
    success: function (res) {
      // success
      var latitude = res.latitude
      var longitude = res.longitude
      var point = {
        latitude: latitude,
        longitude: longitude
      };
      console.log("获取定位成功", point)
      that.setData({
        point: point
      })
      if (!isTogether(that.data.coursePoint, point)) {
        wx.showModal({
          title: '提示',
          content: '签到失败：未在指定范围内进行签到',
        })
        return
      }

      var ziduan = that.data.courseId
      SQL.update('user', app.globalData.userDataBaseInfo._Id, {
        signIn: {
          [ziduan]: true
        }
      })
      that.setData({ isSign: true })
      wx.showToast({
        title: '签到成功',
        icon: 'success',
        duration: 1000
      })


    },
    fail: function (err) {
      wx.showModal({
        title: '提示',
        content: '获取定位失败：请检查是否允许获取位置或检查网络',
      })
      console.log("获取定位失败", err)
    }
  })
}

function isTogether(p1, p2) {
  if (Math.abs(p1.latitude * 1000 - p2.latitude * 1000) < 3 && Math.abs(p1.longitude * 1000 - p2.longitude * 1000) < 5)
    return true
  return false
}