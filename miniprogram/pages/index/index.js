//index.js
const app = getApp()
const SQL = require("../../utils/SQL.js");
const MENU_WIDTH_SCALE = 0.82;
const FAST_SPEED_SECOND = 300;  
const FAST_SPEED_DISTANCE = 5;
const FAST_SPEED_EFF_Y = 50;
Page({
  data: {
    todo: "点击搜索加入班课",
    userInfo: {},
    userDataBaseInfo:{},
    college:'学院',
    claName:'班级',
    courseList: [],
    courseListShow: [],
    categoryTabs: [{ name: '全部', selected: true, id: 0 }, { name: '必修', selected: false, id: 1 }, { name: '选修', selected: false, id: 2 }],
    currentTab: 0,
   power:-1,
    ui: {
      windowWidth: 0,
      menuWidth: 0,
      offsetLeft: 0,
      tStart: true,
    },

    isEmpty:true,

  },


  onLoad: function() {
    console.log('123')
    console.log(app)
    console.log('456')
    var that = this
    this.setData({
        userDataBaseInfo : app.globalData.userDataBaseInfo,
        power : app.globalData.userPower,
        userInfo : app.globalData.userInfo,
        claName : app.globalData.claName,
        college: app.globalData.collegeList[app.globalData.userDataBaseInfo.collegeNum],
        categoryTabs: app.globalData.userPower == app.globalData.powerMenu['student']? [{ name: '全部', selected: true, id: 0 }, { name: '必修', selected: false, id: 1 }, { name: '选修', selected: false, id: 2 }] : [{ name: '我听的课', selected: true, id: 0 }, { name: '我教的课', selected: false, id: 3 }]
    })


  //--
    let res = wx.getSystemInfoSync()
    this.windowWidth = res.windowWidth;
    this.data.ui.menuWidth = this.windowWidth * MENU_WIDTH_SCALE;
    this.data.ui.offsetLeft = 0;
    this.data.ui.windowWidth = res.windowWidth;
    this.setData({ ui: this.data.ui })

    if (this.data.power == app.globalData.powerMenu['teacher']) {
      console.log("欢迎老师")
      this.setData({ todo: '点击+创建一个班课吧' })
    }
    else if (this.data.power == app.globalData.powerMenu['admin'])
      console.log("欢迎帅管理来视察")
    else if (this.data.power == app.globalData.powerMenu['student']){
    console.log("hello 小同学！")

    }
      
    else
        console.log("来者何人！！！")

    getCourseList(that, that.data.userDataBaseInfo.cla_id)  //听课
    getCourseList2(that, that.data.userDataBaseInfo._id)  //叫得可
    
  
  },

  onShow: function (e) {
    var that =this
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight1: res.windowHeight,
          windowWidth1: res.windowWidth,
          autoplay: true
        })
      }
    })
    getCourseList(that, that.data.userDataBaseInfo.cla_id)  //听课
    getCourseList2(that, that.data.userDataBaseInfo._id)  //叫得可
  },

  addClass :function(){
     wx.navigateTo({
       url: '../addClass/addClass',
     })
  },
  search:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // 切换当前选择的分类
  changeCategory(event) {
    var chid = event.target.dataset.id
    // 获取ccurrentTab.没有切换分类
    if (this.data.currentTab === chid) {
      return false
    }
    this.setData({ currentTab: chid })
   this.getNewsList(chid)   
  },
  getNewsList : function(id){
    var  that =this
    var showList=[]
    if (id == 0) 
      showList=that.data.courseList
    else if(id==1)
      for (var i = 0; i < that.data.courseList.length;i++){
        if (!that.data.courseList[i].isXX)
          showList.push(that.data.courseList[i])
      }
    else if(id==2)
        for (var i = 0; i < that.data.courseList.length; i++){
          if (that.data.courseList[i].isXX)
              showList.push(that.data.courseList[i])
        }
    else {  //老师的
      showList = that.data.teachCourseList
    }
      that.setData({
        courseListShow:showList
      })
            
  },
  //下拉刷新
  // onPullDownRefresh: function (e) {
  //   wx.showNavigationBarLoading() //在标题栏中显示加载
  //   var that = this
 
  //   getCourseList(that, that.data.userDataBaseInfo.cla_id)  //都刷新
  //   getCourseList2(that, that.data.userDataBaseInfo._id)
  //   //模拟加载
  //   setTimeout(function (e) {
  //     wx.hideNavigationBarLoading() //完成停止加载
  //     wx.stopPullDownRefresh() //停止下拉刷新
  //   }, 1000);
  // },
  toCourse :function(e){
    var that =this;
    var i = e.currentTarget.id;
    if (that.data.courseListShow[i].createManId == that.data.userDataBaseInfo._id && that.data.power != app.globalData.powerMenu['student'] ){
      console.log("欢迎老师来上课")
      wx.navigateTo({
        url: '../courseManage/courseManage?id=' + that.data.courseListShow[i]._id + "&isSigning=" + that.data.courseListShow[i].isSigning + "&name=" + that.data.userDataBaseInfo.name,
      })
    }
    else{
      console.log("小同学快来上课")
      wx.navigateTo({
        url: '../course/course?id=' + that.data.courseListShow[i]._id + "&isSigning=" + that.data.courseListShow[i].isSigning + "&name=" + that.data.userDataBaseInfo.name,
      })
    }
  },


  //--------------------------------------------------------------------------------------------------------
  handlerStart(e) {
    let { clientX, clientY } = e.touches[0];

    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.tapStartTime = e.timeStamp;
    this.startX = clientX;
    this.data.ui.tStart = true;
    this.setData({ ui: this.data.ui })
  },
  handlerMove(e) {
    let { clientX } = e.touches[0];
    let { ui } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    ui.offsetLeft -= offsetX;
    if (ui.offsetLeft <= 0) {
      ui.offsetLeft = 0;
    } else if (ui.offsetLeft >= ui.menuWidth) {
      ui.offsetLeft = ui.menuWidth;
    }
    this.setData({ ui: ui })

  },
  handlerCancel(e) {
    // console.log(e);
  },
  handlerEnd(e) {

    this.data.ui.tStart = false;
    this.setData({ ui: this.data.ui })
    let { ui } = this.data;
    let { clientX, clientY } = e.changedTouches[0];
    let endTime = e.timeStamp;
    var that =this
     //下拉判断
    if ( clientY- this.tapStartY> FAST_SPEED_DISTANCE) {  
      console.log("下拉")
      refresh(that)
      return
    }
     //左滑判断
    //快速滑动
    if (endTime - this.tapStartTime <= FAST_SPEED_SECOND) {
      //向左
      if (this.tapStartX - clientX > FAST_SPEED_DISTANCE) {
        ui.offsetLeft = 0;
      } else if (this.tapStartX - clientX < -FAST_SPEED_DISTANCE && Math.abs(this.tapStartY - clientY) < FAST_SPEED_EFF_Y) {
        ui.offsetLeft = ui.menuWidth;
      } else {
        if (ui.offsetLeft >= ui.menuWidth / 2) {
          ui.offsetLeft = ui.menuWidth;
        } else {
          ui.offsetLeft = 0;
        }
      }
    } else {
      if (ui.offsetLeft >= ui.menuWidth / 2) {
        ui.offsetLeft = ui.menuWidth;
      } else {
        ui.offsetLeft = 0;
      }
    }
    this.setData({ ui: ui })

  },
  handlerPageTap(e) {
    let { ui } = this.data;
    if (ui.offsetLeft != 0) {
      ui.offsetLeft = 0;
      this.setData({ ui: ui })

    }
  },
  handlerAvatarTap(e) {
    let { ui } = this.data;
    if (ui.offsetLeft == 0) {
      ui.offsetLeft = ui.menuWidth;
      this.setData({ ui: ui })
    }
  },
})  //---page

//-------------sql
 function getCourseList(that,cla_id){
 
  SQL.query('cla_course', {
    cla_id: cla_id
  },
    function (res) {
      var list = res.data
      var course_list = []
      for (var i = 0; i < list.length; i++)
        course_list[i] = list[i].course_id
      // console.log(course_list[0], "！！！！！！！！！！！！！！！！")
      SQL.queryPlus('course',
        function (_) {
          return { _id: _.in(course_list) }
        },
        function(res1){
          var empty = (res1.data.length==0)
           that.setData({
             courseList :res1.data,
             courseListShow: res1.data,
             isEmpty: empty
           })
        })
    })
}


function getCourseList2(that, id) {

  SQL.query('course', {
    createManId: id
  },
    function (res1) {
      that.setData({
        teachCourseList: res1.data,
      })
      
      // console.log(course_list[0], "！！！！！！！！！！！！！！！！")
     
    })
}


function refresh(that){
  wx.showNavigationBarLoading() //在标题栏中显示加载
 

  getCourseList(that, that.data.userDataBaseInfo.cla_id)  //都刷新
  getCourseList2(that, that.data.userDataBaseInfo._id)
  //模拟加载
  setTimeout(function (e) {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  }, 1000);
}
