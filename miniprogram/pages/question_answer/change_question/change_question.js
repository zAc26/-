const SQL = require("../../../utils/SQL.js");
var app = getApp();

var initdata = function (that) {
  var list = that.data.choiceArray
  for (var i = 0; i < list.length; i++) {
    list[i].txtStyle = ""
  }
  var list1 = that.data.questionArray
  for (var i = 0; i < list1.length; i++) {
    list1[i].txtStyle = ""
  }
  that.setData({
    choiceArray: list,
    questionArray: list1,
  })
}

Page({
  data: {
    delBtnWidth: 180,//删除按钮宽度单位（rpx）,
    courseId: "",
    choiceArray: [],
    questionArray: [],
  },
  //修改简答题
  questionInput: function (e) {
    wx.navigateTo({
      url: '../upload_question/upload_question?id=' + e.target.id + '&courseId=' + this.data.courseId,
    })
  },
  //修改选择题
  choiceInput: function (e) {
    wx.navigateTo({
      url: '../upload_choice/upload_choice?id=' + e.target.id + '&courseId=' + this.data.courseId,
    })
  },

  delChoice: function (e) {
    var that = this;
    //确定框
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (res) => {
        //用户点击确定
        if (res.confirm) {
          console.log("删除选择题事件");
          //在库中删除
          SQL.delByIdPlus('choice', e.target.id, function (res) {
            wx.showToast({
              title: '删除选择题成功！',
              icon: 'success',
              duration: 1000
            });

            wx.cloud.callFunction({
              // 云函数名称
              name: 'del',
              // 传给云函数的参数
              data: {
                DB: "choice_answer",
                id: {
                  choice_id: e.target.id
                }
              },
              success(res) {
                console.log(res)
              },
              fail: console.error
            })

            //临时数组，存放选择题数组
            var array = that.data.choiceArray;
            //删除
            array.splice(e.target.dataset.index, 1);
            //设置
            that.setData({
              choiceArray: array,
            });
          });
        } else if (res.cancel) {
          console.log("取消删除")
        }
      }
    })

  },

  delQuestion: function (e) {
    var that = this;
    //确定框
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (res) => {
        if (res.confirm) {
          //用户点击确定
          console.log("删除简答题事件");
          //在库中删除
          SQL.delByIdPlus('question', e.target.id, function (res) {
            wx.showToast({
              title: '删除选择题成功！',
              icon: 'success',
              duration: 1000
            });

            wx.cloud.callFunction({
              // 云函数名称
              name: 'del',
              // 传给云函数的参数
              data: {
                DB: "question_answer",
                id: {
                  question_id: e.target.id
                }
              },
              success(res) {
                console.log(res)
              },
              fail: console.error
            })

            //在页面中删除
            var array = that.data.questionArray;
            array.splice(e.target.dataset.index, 1);
            that.setData({
              questionArray: array,
            });
          });
        } else if (res.cancel) {
          console.log("取消删除")
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this;


    that.setData({
      courseId: options.courseId,
    })
    SQL.query('choice', {
      course_id: options.courseId,
    },
      function (res) {
        console.log(res);
        SQL.query('question', {
          course_id: options.courseId,
        },
          function (res1) {
            that.setData({
              choiceArray: res.data,
              questionArray: res1.data,
            });
            console.log(that.data.choiceArray);
            console.log(that.data.questionArray);
          })
      })
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },

  touchM: function (e) {
    var that = this
    initdata(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var choiceArray = this.data.choiceArray;
      choiceArray[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        choiceArray: choiceArray
      });
    }
  },
  touchM1: function (e) {
    var that = this
    initdata(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var questionArray = this.data.questionArray;
      questionArray[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        questionArray: questionArray
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var choiceArray = this.data.choiceArray;
      choiceArray[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        choiceArray: choiceArray
      });
    }
  },
  touchE1: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var questionArray = this.data.questionArray;
      questionArray[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        questionArray: questionArray
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
})
