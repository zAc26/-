const SQL = require("../../utils/SQL.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",   //标题
    message: "",  //内容
    titleCount: 0,  //标题字数
    messageCount: 0,  //内容字数
    isLook: false,  //是否为查看
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.id != null){
      var len1 = options.title.length;
      var len2 = options.message.length;
      that.setData({
        isLook: true,
        title: options.title,
        message: options.message,
        titleCount: len1,
        messageCount: len2,
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

  message: function (e) {
    var str = e.detail.value;
    var len = str.length;

    this.setData({
      message: e.detail.value,
      messageCount: len,
    })

    console.log(this.data.message);
  },

  submitForm: function (e) {
    var that = this;
    //章节非空判断
    if (that.data.title == "") {
      wx.showToast({
        title: "标题还没填哦~",
        icon: "none",
        duration: 1000,
      })
    } else if (that.data.question == "") { //题目非空判断
      wx.showToast({
        title: "内容还没填哦~",
        icon: "none",
        duration: 1000,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定发布消息吗？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (res) => {
          //如果用户点击确定
          if (res.confirm) {
            console.log("发布消息事件！");
            var date = new Date;
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            var time = year + "-" + month + "-" + day;
            //在数据库中添加
            SQL.addSQLPlus1('message', {
              title: that.data.title,
              message: that.data.message,
              time: time,
            }, function (id) {
              console.log("添加消息成功，消息id:" + id);

              wx.showToast({
                title: '添加消息成功！',
                icon: 'success',
                duration: 1000
              });

              that.setData({
                title: "",  //简答题章节
                message: "", //简答题问题
                titleCount: 0,  //章节字数
                messageCount: 0,   //问题字数
              })
            });

          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });

    }
  }
})