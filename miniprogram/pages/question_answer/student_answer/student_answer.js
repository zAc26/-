const SQL = require("../../../utils/SQL.js");
var app = getApp();

Page({


  /**
   * 页面的初始数据
   */
  data: {
    courseId: "",
    title: "",  //简答题章节
    question: "", //简答题问题
    answer: "", //回答简答题
    titleCount: 0,  //章节字数
    questionCount: 0,   //问题字数
    answerCount: 0, //回答简答题字数
    name: "", //用户的姓名
    questionId: "",  //该问题的id
    isAnswer: false,  //是否回答过
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // console.log(app);
    //设置参数
    that.setData({
      courseId: options.courseId,
      questionId: options.id,
      name: app.globalData.userDataBaseInfo.name,
    });

    //查询题目信息
    SQL.query('question', {
      _id: options.id,
    }, function (res) {
      var titleLength = res.data[0].title.length;
      var questionLength = res.data[0].question.length;

      //设置题目信息
      that.setData({
        title: res.data[0].title,
        question: res.data[0].question,
        titleCount: titleLength,
        questionCount: questionLength,
      });

      //查询是否回答过
      SQL.query('question_answer', {
        name: that.data.name,
        question_id: that.data.questionId,
      }, function (res1) {
        //查询到的回调函数
        console.log(res1);
        var answerLength = res1.data[0].answer.length;

        that.setData({
          answer: res1.data[0].answer,
          answerCount: answerLength,
          isAnswer: true,
        });
      })
    });

  },

  title: function (e) {
    var str = e.detail.value;
    var len = str.length;

    this.setData({
      title: e.detail.value,
      titleCount: len,
    });

    console.log(this.data.title);
  },

  question: function (e) {
    var str = e.detail.value;
    var len = str.length;

    this.setData({
      question: e.detail.value,
      questionCount: len,
    })

    console.log(this.data.question);
  },

  answer: function (e) {
    var str = e.detail.value;
    var len = str.length;

    this.setData({
      answer: e.detail.value,
      answerCount: len,
    });

    console.log(this.data.answer);
  },

  submitForm: function (e) {
    var that = this;

    //回答非空判断
    if (that.data.answer == "") {
      wx.showToast({
        title: "回答不能为空哦~",
        icon: "none",
        duration: 1000,
      });
    } else {
      //选择确定
      wx.showModal({
        title: '提示',
        content: '确定提交吗，只能提交一次哦',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (res) => {
          //如果用户点击确定
          if (res.confirm) {
            console.log("提交简答题事件！");
            //在数据库中更新
            SQL.addSQLPlus1('question_answer', {
              question_id: that.data.questionId,
              name: that.data.name,
              answer: that.data.answer,
            }, function (id) {
              console.log("上传答案成功，答案id：" + id);

              wx.showToast({
                title: "上传答案成功",
                icon: "none",
                duration: 1000,
              });
              //关闭当前页面，跳到change_answer页面
              wx.redirectTo({
                url: '../look_answer/look_answer?courseId=' + that.data.courseId,
                success: (res) => {

                },
                fail: () => { },
                complete: () => { }
              });
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  }
})