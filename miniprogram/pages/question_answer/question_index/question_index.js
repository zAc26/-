//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    courseId: "",
    power: "",
  },

  onLoad: function (options) {
    var that = this;

    console.log(app);

    that.setData({
      courseId: options.courseId,
      power: app.globalData.userPower,
    })
  },
  //上传简答题
  answer: function () {
    wx.navigateTo({
      url: "../upload_question/upload_question?courseId=" + this.data.courseId,
    })
  },
  //上传选择题
  choice: function () {
    wx.navigateTo({
      url: "../upload_choice/upload_choice?courseId=" + this.data.courseId,
    })
  },
  //编辑上传题目
  change: function () {
    wx.navigateTo({
      url: "../change_question/change_question?courseId=" + this.data.courseId,
    })
  },
  //使用说明
  btnIntroduce: function () {
    wx.navigateTo({
      url: "../student_choice/student_choice?courseId=" + this.data.courseId,
    })
  },

  //回答选择题
  student_choice: function () {
    wx.navigateTo({
      url: "../student_choice/student_choice?courseId=" + this.data.courseId,
    })
  },

  //回答简答题
  student_answer: function () {
    wx.navigateTo({
      url: "../look_answer/look_answer?courseId=" + this.data.courseId,
    })
  },

})
