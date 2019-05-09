const SQL = require("../../../utils/SQL.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChange: false,  //是否是从编辑页面过来的
    question: "",   //问题
    questionCount: 0, //问题字数
    answerA: "",  //A选项
    answerB: "",  //B选项
    answerC: "",  //C选项
    answerD: "",  //D选项
    answer: {}, //正确选项的集合
    courseId: "", //当前课程id
    _id: "",  //如果是编辑页面过来的，就会有该问题的id
    checkboxs: [
      { value: "A", checked: "" },
      { value: "B", checked: "" },
      { value: "C", checked: "" },
      { value: "D", checked: "" }
    ],  //选择框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //判断是从编辑页面过来的还是从新建页面传来的

    if (options.id != null) {  //从编辑页面来的
      that.setData({
        _id: options.id,
        courseId: options.courseId,
        isChange: true,
      });
      //查询数据库，设置参数
      SQL.query('choice', {
        _id: options.id,
      },
        function (res) {
          //设置答案
          for (var i = 0; i < res.data[0].answer.length; i++) {
            var answer = res.data[0].answer[i];
            if (answer == "A") {
              var str = "checkboxs[" + 0 + "].checked";
              that.setData({
                [str]: "true"
              });
            } else if (answer == "B") {
              var str = "checkboxs[" + 1 + "].checked";
              that.setData({
                [str]: "true"
              });
            } else if (answer == "C") {
              var str = "checkboxs[" + 2 + "].checked";
              that.setData({
                [str]: "true"
              });
            } else if (answer == "D") {
              var str = "checkboxs[" + 3 + "].checked";
              that.setData({
                [str]: "true"
              });
            }
          }
          //把数据库中的参数传到页面
          var len = res.data[0].question.length;
          that.setData({
            question: res.data[0].question,
            questionCount: len,
            answer: res.data[0].answer,
            answerA: res.data[0].choiceArray[0],
            answerB: res.data[0].choiceArray[1],
            answerC: res.data[0].choiceArray[2],
            answerD: res.data[0].choiceArray[3],
          })
        })
    } else {  //从新建页面来的
      that.setData({
        courseId: options.courseId,
      })
    }
  },

  question: function (e) {
    var len = e.detail.value.length;
    this.setData({
      question: e.detail.value,
      questionCount: len,
    });
    console.log("问题：" + this.data.question);
  },

  answerA: function (e) {
    this.setData({
      answerA: e.detail.value
    });
    console.log("选项A：" + this.data.answerA);
  },

  answerB: function (e) {
    this.setData({
      answerB: e.detail.value
    });
    console.log("选项B：" + this.data.answerB);
  },

  answerC: function (e) {
    this.setData({
      answerC: e.detail.value
    });
    console.log("选项C：" + this.data.answerC);
  },

  answerD: function (e) {
    this.setData({
      answerD: e.detail.value
    });
    console.log("选项D：" + this.data.answerD);
  },

  checkboxgroupBindchange: function (e) {
    this.setData({
      answer: e.detail.value
    });
    console.log("答案：" + this.data.answer);
  },

  submitForm: function (e) {
    var that = this;
    if (that.data.question == "") { //题目非空判断
      wx.showToast({
        title: "题目还没填哦~",
        icon: "none",
        duration: 1000,
      })
    } else if (that.data.answerA == "") { //A选项非空判断
      wx.showToast({
        title: "A选项还没填哦~",
        icon: "none",
        duration: 1000,
      })
    } else if (that.data.answerB == "") { //B选项非空判断
      wx.showToast({
        title: "B选项还没填哦~",
        icon: "none",
        duration: 1000,
      })
    } else if (that.data.answerC == "") { //C选项非空判断
      wx.showToast({
        title: "C选项还没填哦~",
        icon: "none",
        duration: 1000,
      })
    } else if (that.data.answerD == "") { //D选项非空判断
      wx.showToast({
        title: "D选项还没填哦~",
        icon: "none",
        duration: 1000,
      })
    } else if (JSON.stringify(that.data.answer) == "{}") {  //正确选项非空判断
      wx.showToast({
        title: "正确答案还没填哦~",
        icon: "none",
        duration: 1000,
      })
    } else {
      //如果是编辑
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
            //用户点击确定
            if (res.confirm) {
              console.log("修改选择题事件！");

              //更新数据库
              SQL.updatePlus('choice', that.data._id, {
                question: that.data.question,
                choiceArray: [
                  that.data.answerA,
                  that.data.answerB,
                  that.data.answerC,
                  that.data.answerD
                ],
                answer: that.data.answer,
              }, function (res) {
                console.log("更新成功");
                console.log(res);
                wx.showToast({
                  title: '修改选择题成功！',
                  icon: 'success',
                  duration: 1000
                });
                //关闭当前页面，跳到change_answer页面
                wx.redirectTo({
                  url: '../change_question/change_question?courseId=' + that.data.courseId,
                });

              })
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        })

      } else {  //如果是提交
        wx.showModal({
          title: '提示',
          content: '确定提交吗',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (res) => {
            if (res.confirm) {  //用户点击确定，添加数据库，设置问题，选项等为空

              console.log("提交选择题事件！");

              SQL.addSQLPlus1('choice', {
                question: that.data.question,
                choiceArray: [
                  that.data.answerA,
                  that.data.answerB,
                  that.data.answerC,
                  that.data.answerD
                ],
                course_id: that.data.courseId,
                answer: that.data.answer,
              },
                function (id) {
                  console.log("添加成功，选择题id:" + id);
                  wx.showToast({
                    title: '添加选择题成功',
                    icon: 'success',
                    duration: 1000
                  });
                  that.setData({
                    isChange: false,
                    question: "",   //问题
                    questionCount: 0, //问题字数
                    answerA: "",  //A选项
                    answerB: "",  //B选项
                    answerC: "",  //C选项
                    answerD: "",  //D选项
                    answer: {}, //正确选项的集合
                    checkboxs: [
                      { value: "A", checked: "" },
                      { value: "B", checked: "" },
                      { value: "C", checked: "" },
                      { value: "D", checked: "" }
                    ],   //选择框
                  })
                })
            } else if (res.cancel) {
              console.log("取消了操作");
            }
          }
        });

      }
    }
  }
})