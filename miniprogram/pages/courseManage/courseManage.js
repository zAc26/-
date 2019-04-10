// pages/courseManage/courseManage.js

const SQL = require("../../utils/SQL.js");
const app = getApp()
const FCC = require("../../utils/FCC.js");
var iconPath = "/static/icons/" 
var tabs = [
  {
    "icon": iconPath + "mark.png",
    "iconActive": iconPath + "markHL.png",
    "title": "签到",
    "extraStyle": "",
  },
  {
    "icon": iconPath + "collect.png",
    "iconActive": iconPath + "collectHL.png",
    "title": "题库",
    "extraStyle": "",
  },
  {
    "icon": iconPath + "like.png",
    "iconActive": iconPath + "likeHL.png",
    "title": "互动",
    "extraStyle": "",
  },
  {
    "icon": iconPath + "more.png",
    "iconActive": iconPath + "moreHL.png",
    "title": "设置",
    "extraStyle": "border:none;",
  },
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId: '',//////gai   XFsXhgGicn9ybupV
    tabs: tabs,
    // 当前选中的标签
    currentTab: "tab1",
    headTab:0,
    // 高亮的标签索引
    highLightIndex: "0",
    // 模态对话框样式 
    modalShowStyle: "",
    // 待新建的日记标题
    diaryTitle: "",
    categoryTabs: [{ name: '全部', selected: true, id: 0 }, { name: '已签到', selected: false, id: 1 }, { name: '未签到', selected: false, id: 2 }],
    stuList:[],
    stuListShow: [],
    isSigning:false,
    isLoading: false,
    isdisabled: false,
    signNum:0,
     point : {},
    messageList:[
      { userId: 'sfsdfsdf', content: 'UI是对庵后' }, { userId:'XFh-aHffS3SWKN_d',content :'什么桂东成'}
    ]
  },

// ----------------------------------------签到 
  signIn :function(){
      var that = this





    if (!that.data.isSigning){  //发起签到

      var result = getLoc(that)
      if (!result) return
      
      that.setData({
        isLoading: true,
        isdisabled: true,
      })
    SQL.update('course', that.data.courseId, {
      'isSigning': !that.data.isSigning
    })
    initSign(that)
  
    }
    else{    //关闭签到
      wx.showModal({
        title: '提示',
        content: '确定关闭签到？',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              isLoading: true,
              isdisabled: true,
            })
            console.log('用户点击确定')
            SQL.update('course', that.data.courseId, {  
              'isSigning': !that.data.isSigning
            })
            wx.showToast({
              title: '关闭成功',
              icon: 'success',
              duration: 888
            })
            setTimeout(function () {
              that.setData({
                isLoading: false,
                isdisabled: false,
                isSigning: !that.data.isSigning,
              })
            },  500) //  //待调整
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }


  },
  //--------------------------------------------------
      //-------------------------------设置
delCourse :function(){
  var that=this
   wx.showModal({
     title: '提示',
     content: '确认删除该课程？（此操作无法撤回！）',
     success: function (res) { 
       if (res.confirm) { that.setData({isLoading: true, isdisabled: true, })
              FCC.delCourseById(that.data.courseId)
         wx.showToast({  title: '删除成功',  icon: 'success',duration: 1500
         })
         setTimeout(function () {
           that.setData({isLoading: false,isdisabled: false
           })
           wx.navigateBack({ })
         }, 3000) //  //待调整

       }
     },
    //  fail: function (err) {  console.log("取消"+err)},
   })
},
    //--------------------------------------------------

  // 点击tab项事件
  touchTab: function (event) {
    var tabIndex = parseInt(event.currentTarget.id);
    var template = "tab" + (tabIndex + 1).toString();
    this.setData({
      currentTab: template,
      highLightIndex: tabIndex.toString()
    }
    );
  },
  //**切换 */
  changeCategory(event) {
    var that =this
    var chid = parseInt(event.target.dataset.id) 
    if (that.data.currentTab === chid) {
      return false
    }
    if (!that.data.isSigning) {
        postError(that,"请先发起签到") 
          return }
    var list=[]
    if (chid == 0)   list = that.data.stuList   //全部
    else if (chid == 1){ //已签到
      for (var i = 0; i < that.data.stuList.length; i++)
        if (that.data.stuList[i].signIn[that.data.courseId])
             list.push(that.data.stuList[i]) }
    
    else if (chid == 2)  {//未签到
        for (var i = 0; i < that.data.stuList.length; i++)
          if (!that.data.stuList[i].signIn[that.data.courseId])
            list.push(that.data.stuList[i])}

    that.setData({ 
      headTab: chid,
      stuListShow:list
     })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var that = this
    var isSigning = false
    if (options.isSigning =="true")
         isSigning = true

    that.setData({
      courseId: options.id,
      isSigning: isSigning
    })

    refresh(that)
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that= this
  
  },


  //下拉刷新
  onPullDownRefresh: function (e) {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    refresh(that)
    //模拟加载
    setTimeout(function (e) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },



})
// ///////////////////////////////////////////////////////////////////////////////////////////////

function refresh(that){ ////刷新
  console.log("！！！！！！",that.data.courseId);
  
  FCC.getStuByCourseId(that.data.courseId, function (res_list) {
    var num=0;
    // console.log(list)
    for (var i = 0; i < res_list.length;i++){
      // console.log(res_list[i].hasOwnProperty('signIn'),"<-")
      if (res_list[i].hasOwnProperty('signIn')&&res_list[i].signIn.hasOwnProperty(that.data.courseId) && res_list[i].signIn[that.data.courseId]) { num++; }
    }

    that.setData({
      stuList: res_list,
      stuListShow: res_list,
      signNum:num,
      headTab:0
    })
  }) 

}

function initSign(that ){
     var userList =that.data.stuList
     var ziduan = that.data.courseId
     for(var i = 0;i<userList.length;i++){
       SQL.update('user', userList[i]._id,{
         signIn:{
           [ziduan] : false
         }
       })
     }
  wx.showLoading({
    // title: '初始化签到列表',
    title: '正在获取位置',
  })
  setTimeout(function () {
    wx.hideLoading()
   
   that.setData({
     isLoading: false,
     isdisabled: false,
     isSigning: !that.data.isSigning,
   })

  }, userList.length*200) //  //待调整
}

function postError(that, content) {
  that.setData({
    showTopTips: true,
    TopTips: content
  });
  setTimeout(function () {
    that.setData({
      showTopTips: false
    });
  }, 1000);
}

function getLoc(that){
  //获取当前位置
  wx.getLocation({
    type: 'gcj02',// 默认为 wgs84 返回 gps 坐标，gcj02 返回可用wx.openLocation 的坐标
    success: function (res) {
      // success
      var latitude = res.latitude
      var longitude = res.longitude
      var point = {
        latitude: latitude,
        longitude: longitude
      };
      console.log("获取定位成功",point)
      that.setData({
        point: point
      })
      SQL.update('course', that.data.courseId, {
        point: point
      })

      return true
    }
    ,fail(err){
        wx.showModal({
          title: '错误提示' ,
          content: '定位失败，请检查是否允许小程序获取定位信息',
        })
        return false
    }
  })
}