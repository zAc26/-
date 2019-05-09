const SQL = require("../../../utils/SQL.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId: "", //课程id
    items: [],  //存放题目，答案，选项
    length: 0,  //总题数
    now: 0,   //当前题目
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      courseId: options.courseId,
    });

    //查询该课程所有选择题
    SQL.query('choice', {
      course_id: options.courseId,
    }, function (res) {
      console.log(res);

      //查询同学回答的答案
      SQL.query('choice_answer', {
        _openid: app.globalData.openId,
        course_id: options.courseId,
      }, function (res1) {
        console.log(res1);

        // 保存选择题信息
        for (var i = 0; i < res.data.length; i++) {

          var flag = false;

          // 查询是否回答过该答案
          for (var j = 0; j < res1.data.length; j++) {
            // 是否回答过该答案
            // 如果回答过，置flag为true，
            if (res.data[i]._id == res1.data[j].choice_id) {
              var item = {
                _id: res.data[i]._id, //该问题的id
                question: res.data[i].question, //题目
                choiceArray: res.data[i].choiceArray, //选项
                answer: res.data[i].answer, //答案
                isAnswer: true, //回答过
                student_answer: res1.data[j].answer,  //选择的答案
              };
              that.data.items.push(item);
              flag = true;
              break;
            }
          }

          //如果没回答过
          if (!flag) {
            var item = {
              _id: res.data[i]._id, //该问题的id
              question: res.data[i].question, //题目
              choiceArray: res.data[i].choiceArray, //选项
              answer: res.data[i].answer, //答案
              isAnswer: false, //回答过
            };
            that.data.items.push(item);
          }
        }

        console.log(that.data.items);
        that.setData({
          length: res.data.length,
          items: that.data.items,
        });

      })
    })
  },

  //点击答案回答
  btnOpClick: function (e) {
    var that = this;
    if (!that.data.items[that.data.now].isAnswer) {
      console.log("你选的答案是：" + e.target.id);
      console.log("这道题的id是：" + that.data.items[that.data.now]._id);
      console.log("你的名字是：" + app.globalData.userDataBaseInfo.name);

      // 往数据库中添加答案
      SQL.addSQLPlus1('choice_answer', {
        name: app.globalData.userDataBaseInfo.name, //姓名
        choice_id: that.data.items[that.data.now]._id,  //选择题号
        answer: e.target.id,  //选择的答案
        course_id: that.data.courseId,  //课程id
      }, function (id) {
        //添加成功后的回调函数
        console.log("上传选择题答案成功，id为：" + id);
        var isAnswer1 = "items[" + that.data.now + "].isAnswer";
        // 改变items数组中的值
        that.setData({
          [isAnswer1] : true,
        });
        var isAnswer2 = "items[" + that.data.now + "].student_answer";
        that.setData({
          [isAnswer2] : e.target.id,
        })
        if (that.data.now >= that.data.length - 1) {
          wx.showToast({
            title: "已经最后一题了哦~",
            icon: "none",
            duration: 1000,
          });
        } else {
          that.setData({
            now: that.data.now + 1,
          })
        }
      })
    } else {
      wx.showToast({
        title: "这道题已经答过了哦~",
        icon: "none",
        duration: 1000,
      });
    }
  },

  /**
   * 上一题
   */
  lastQuestion: function (e) {
    var that = this;

    if (that.data.now <= 0) {
      wx.showToast({
        title: "已经是第一题了哦！",
        icon: "none",
        duration: 1000,
      });
    } else {
      that.setData({
        now: that.data.now - 1,
      })
    }
  },

  /**
   * 下一题
   */
  nextQuestion: function (e) {
    var that = this;
    if (that.data.now >= that.data.length - 1) {
      wx.showToast({
        title: "已经是最后一题了哦！",
        icon: "none",
        duration: 1000,
      });
    } else {
      that.setData({
        now: that.data.now + 1,
      })
    }
  }
})