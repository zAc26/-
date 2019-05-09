const SQL = require("../../../utils/SQL.js");
var app = getApp();
Page({
  data: {
    courseId: "",
    questionArray: [],
  },
  //修改简答题
  questionInput: function (e) {
    wx.navigateTo({
      url: '../student_answer/student_answer?id=' + e.target.id + '&courseId=' + this.data.courseId,
    })
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      courseId: options.courseId,
    });
    SQL.query('question', {
      course_id: options.courseId,
    },
      function (res) {
        console.log(res);
        that.setData({
          questionArray: res.data,
        });
      })
  }
})
