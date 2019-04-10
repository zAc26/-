//login.js
//获取应用实例
var app = getApp();
const SQL = require("../../utils/SQL.js");
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {},
    isLoading:false,
    isdisabled:false
  },


  onGetUserInfo: function (e) {//获取头像昵称
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      app.globalData.userInfo = this.data.userInfo
      console.log("!!", app.globalData.userInfo)
    }
  },
  onGetOpenid: function () {

    // 调用云函数
    var that =this
    that.setData({
      isdisabled:true,
      isLoading:true
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openId= res.result.openid
        console.log('[云函数] [login] user openid: ', app.globalData.openId)
        findUser(res.result.openid, that)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      

      }
    })
  },




  onLoad:function(){
   //载入学院列表
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('college').where({
      _id: 'XFUfjlsqTi00tmod'
    }).get({
      success: res => {
        // console.log(res.data[0].collegeArray)
       
         app.globalData.collegeList=res.data[0].collegeArray
       
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '获取学院信息失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

  },
  onShow:function(){
  
  },
  onReady: function(){
    var _this = this;
    setTimeout(function(){
      _this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x*30).toFixed(1);
      if(angle>14){ angle=14; }
      else if(angle<-14){ angle=-14; }
      if(_this.data.angle !== angle){
        _this.setData({
          angle: angle
        });
      }
    });
  },
});


//-------------- -sql --------------------
//根据openid查询  并跳转
function  findUser( oid ,that) {
  const db = wx.cloud.database()
  // 查询当前用户所有的 counters
  db.collection('user').where({
    _openid: oid
  }).get({
    success: res => {
      that.setData({
        // queryResult: JSON.stringify(res.data, null, 2)
        queryResult: res.data
      })
      console.log('[数据库] [查询记录] 成功: ', res)
      
      // console.log('[数据库] [查询记录] 成功@@@@@@ app.globalData.userDataBaseInfo: ', app.globalData.userDataBaseInfo)
      if(res.data.length==0){//---------未找到--新用户
        wx.showLoading({
          title: '请先注册',
        })
        setTimeout(function () {
          wx.hideLoading()
          wx.navigateTo({
            url: '../register/register',
          })
        }, 800)
      }
      else{          //---老客户
        app.globalData.userDataBaseInfo = res.data[0]
        app.globalData.userPower = res.data[0]['power']
        SQL.query('cla',{
          _id: res.data[0].cla
        },
        function(res){
          app.globalData.claName = res.data[0].claName
        })

        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
    
          wx.switchTab({
            url: '../index/index',
          })
        }, 1000)
      }
     
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
    }
  })


}