const SQL = require("../../../utils/SQL.js");
var app = getApp();

Page({


  /**
   * 页面的初始数据
   */
  data: {
    isChange: false,  //是否是从编辑页面过来的
    courseId: "", //课程的id
    title: "",  //简答题章节
    question: "", //简答题问题
    titleCount: 0,  //章节字数
    questionCount: 0,   //问题字数
    _id: "",  //如果是从编辑页面过来的，就会有_id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.id != null) {  //如果是从编辑页面过来的
      that.setData({
        courseId: options.courseId,
        _id: options.id,
        isChange: true,
      });
      //查询数据库，设置参数
      SQL.query('question', {
        _id: options.id,
      }, function (res) {
        var titleLength = res.data[0].title.length;
        var questionLength = res.data[0].question.length;

        that.setData({
          title: res.data[0].title,
          question: res.data[0].question,
          titleCount: titleLength,
          questionCount: questionLength,
        })
      });
    } else {  //如果是新建
      that.setData({
        courseId: options.courseId,
      });
    }

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

  submitForm: function (e) {
    var that = this;
    //章节非空判断
    if (that.data.title == "") {
      wx.showToast({
        title: "章节还没填哦~",
        icon: "none",
        duration: 1000,
      })
    } else if (that.data.question == "") { //题目非空判断
      wx.showToast({
        title: "题目还没填哦~",
        icon: "none",
        duration: 1000,
      })
    } else {
      //如果是从编辑页面过来的
      if (that.data.isChange) {
        wx.showModal({
          title: '提示',
          content: '确定修改吗',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (res) => {
            //如果用户点击确定
            if (res.confirm) {
              console.log("修改简答题事件！");
              //在数据库中更新
              SQL.updatePlus('question', that.data._id, {
                question: that.data.question,
                title: that.data.title,
              }, function (res) {
                console.log("修改成功！");

                wx.showToast({
                  title: '修改简答题成功！',
                  icon: 'success',
                  duration: 1000
                });
                //关闭当前页面，跳到change_answer页面
                wx.redirectTo({
                  url: '../change_question/change_question?courseId=' + that.data.courseId,
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

      } else {  //新建页面过来的
        //给用户一个确定框
        wx.showModal({
          title: '提示',
          content: '确定提交吗',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (res) => {
            //用户点击确定
            if (res.confirm) {
              console.log("添加简答题事件！");
              //入库，把章节、内容等置为空
              SQL.addSQLPlus1('question', {
                question: that.data.question,
                course_id: that.data.courseId,
                title: that.data.title,
              }, function (id) {
                console.log("上传填空题成功，填空题id:" + id);

                wx.showToast({
                  title: '添加简答题成功！',
                  icon: 'success',
                  duration: 1000
                });

                that.setData({
                  title: "",  //简答题章节
                  question: "", //简答题问题
                  titleCount: 0,  //章节字数
                  questionCount: 0,   //问题字数
                })
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        })
      }
    }
  }

})