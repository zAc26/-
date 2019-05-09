var app = getApp();
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
Page({
  data: {
    inputVal: "",
    scrollHeight: '100vh',
    inputBottom: 0,
    socket_open: false,//判断连接是否打开
    sendText: "",//发送的消息
    serverMsg: [],//接受的服务端的消息
    userInfo: {},//app.appData.userInfo,
    scrolltop: 999,
    openId: "",
    courseId: "",
    info: [],
    myServerMsg: [], //页面显示的信息
    first: true,
    name: ""
  },

  onLoad: function (options) {
    // app.login();
    // this.setData({
    //     userInfo: app.appData.userInfo
    // });
    //初始化
    console.log(options);
    this.setData({
      openId: app.globalData.openId,
      userInfo: app.globalData.userInfo,
      courseId: options.courseId,
      name: options.name
    })
    // console.log(this.data);
    // console.log(app);
    // console.log(this.data.userInfo);
    // console.log(app.globalData);
    this.wssInit();
  },

  //页面卸载，关闭socket连接
  onUnload: function () {
    wx.closeSocket({
      code: 1000,
      reason: '',
      success: (result) => {
        console.log(result);
        console.log("webSocket连接关闭");
      },
      fail: () => { console.log("webSocket连接未正常关闭"); },
      complete: () => { }
    });
  },

  wssInit() {
    var that = this;
    //建立连接
    wx.connectSocket({
      url: 'wss://xiaotingfeng.top:8888/'//app.appData.socket
    })
    //监听WebSocket连接打开事件。
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！');
      that.setData({
        socket_open: true
      });

      //将课程号信息传递给服务器
      var msg = {
        level: 1,
        courseId: that.data.courseId
      }
      // console.log(msg);
      //发送课程id给服务器
      that.send_socket_message(JSON.stringify(msg));

    });
    //监听WebSocket接受到服务器的消息事件。
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：', res);
      var server_msg = JSON.parse(res.data);
      console.log(server_msg);

      // 处理服务端的数据
      // 第一次请求，处理历史数据
      if (server_msg != null && that.data.first) {
        // 循环遍历服务器传来的历史记录数据
        for (var i = 0; i < server_msg[0].msg.length; i++) {
          // 将数据加入myServerMsg在页面显示
          that.data.myServerMsg.push(server_msg[0].msg[i]);
        }

        that.setData({
          first: false,
          myServerMsg: that.data.myServerMsg,
          scrolltop: that.data.myServerMsg.length * 100
        });
      } else {
        //之后的请求
        // 将数据加入myServerMsg在页面显示
        that.data.myServerMsg.push(server_msg[0].msg);
        that.setData({
          myServerMsg: that.data.myServerMsg,
          scrolltop: that.data.myServerMsg.length * 100
        });
      }

      console.log(that.data.myServerMsg);

    });
    //监听WebSocket错误。
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！', res)
    });

  },


  /**输入内容 */
  sendTextBind: function (e) {
    this.setData({
      sendText: e.detail.value
    });
    console.log(this.data.sendText);
  },
  /**发送消息 */
  sendBtn: function (e) {
    console.log('发送消息事件！');
    this.setData({
      userInfo: app.globalData.userInfo
    })

    var msgJson = {
      avatarUrl: this.data.userInfo.avatarUrl,
      courseId: this.data.courseId,
      openId: this.data.openId,
      message: this.data.sendText,//发送的消息
      name: this.data.name
    }
    console.log(msgJson);
    //发送消息
    this.send_socket_message(JSON.stringify(msgJson));
    this.setData({
      sendText: ""//发送消息后，清空文本框
    });
  },

  send_socket_message: function (msg) {
    //socket_open，连接打开的回调后才会为true，然后才能发送消息
    if (this.data.socket_open) {
      wx.sendSocketMessage({
        data: msg
      })
    }
  },

  /**
   * 获取聚焦
   */
  focus: function (e) {
    var that = this;
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (that.data.serverMsg.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    var that = this;
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (that.data.serverMsg.length - 1)
    })

  },
})