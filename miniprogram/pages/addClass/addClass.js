// pages/addClass/addClass.js

var app = getApp();
var Bmob = require("../../utils/bmob.js");
const SQL = require("../../utils/SQL.js");
const FILE = require("../../utils/FILE.js");

 var date = new Date;
var year = date.getFullYear(); 
var month = date.getMonth() + 1;
var day = date.getDate()
var uuid = "" + year % 100 + month + day + date.getHours() + date.getMinutes()
var uuNum=0


Page({

  /**
   * 页面的初始数据
   */
  data: {
    college: [],
    typeIndex: "0",
    term:[],
    termIndex:0,
    TopTips: '',
    peopleHide: false,
    src: "",
    isSrc: false,
    isAgree: false,
    input_code: "",
    noteMaxLen: 200,//备注最多字数
    content: "",
    noteNowLen: 0,//备注当前字数
    isTouchMove: false ,//默认隐藏删除
    claList: [],


  },
  onLoad :function(){
    var that  = this 
    that.setData({
      college: app.globalData.collegeList
    })
    var term = ['' + (year - 1) + '学年下学期', '' + year  + '学年上学期' ]
      
    var ind =month>=7?  1:0
    that.setData({
      term: term,
      termIndex: ind,
      userDataBaseInfo: app.globalData.userDataBaseInfo,
    })
  },
  onShow:function(){
     var that=this
     date = new Date;
     year = date.getFullYear();
     month = date.getMonth() + 1;
     day = date.getDate()
     uuid = "" + year % 100 + month + day + date.getHours() + date.getMinutes()
     
    getUUID(that)
  },

  tapNotice: function (e) {
    if (e.target.id == 'notice') {
      this.hideNotice();
    }
  },
  showNotice: function (e) {
    this.setData({
      'notice_status': true
    });
  },
  hideNotice: function (e) {
    this.setData({
      'notice_status': false
    });
  },

  //学院改变
  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  //学期改变
  bindtermChange: function (e) {
    this.setData({
      termIndex: e.detail.value
    })
  },
  //字数改变触发事件
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      content: value, noteNowLen: len
    })
  },
  //新增班级-------------------------------------------------------
  addClaList  :function(e){
    var that = this
    var lists = this.data.claList;
     if(e.detail.value=="") return
     else {
      var  cla = e.detail.value
       var claReg = new RegExp("[1-9][0-9]{3}");
       if (cla != "" && cla.length != 4 && !claReg.test(cla)) {
         postError(that, '班级格式一般为4位数字(形如1603)')
       }
      else {  //允许添加
        
         SQL.addSQLPlus1('cla',{
             collegeNum: that.data.typeIndex,
             claName :cla
         },
           function (cla_id) {
             var list = { "content": cla, 'isTouchMove': false, 'id': cla_id }
             lists.push(list);
             that.setData({
               input_code: "",
               claList: lists,
             })
           }
         )
       
      
      }
     }
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.claList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      claList: this.data.claList
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.claList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      claList: that.data.claList
    })
  },
  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
     _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
  del: function (e) {
    var that = this
    //1.删除数据库里的cla
    SQL.delById('cla', that.data.claList[e.currentTarget.dataset.index].id)
    that.data.claList.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      claList: this.data.claList
    })
  },

//------------------------------------------------
  //上传活动图片
  uploadPic: function () {//选择图标
  var that=this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], //压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrc: true,
          src: tempFilePaths
        })
      }
    })
  },

  //删除图片
  clearPic: function () {//删除图片
    var that = this
    that.setData({
      isSrc: false,
      src: ""
    })
  },
  //限制人数
  switch1Change: function (e) {
    if (e.detail.value == false) {
      this.setData({
        peopleHide: false
      })
    } else if (e.detail.value == true) {
      this.setData({
        peopleHide: true
      })
    }
  },
  //同意相关条例
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length,
      showInput: !this.data.showInput
    });
  },
  //************************************************* */
  //表单验证
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  //提交表单
  submitForm: function (e) {
    var that = this;

    if (that.data.isAgree == false) {
      wx.showModal({
        title: '提示',
        content: '请先阅读并同意《创建须知》'
      })
      return;
    }

    var classInfo={};
    var name = e.detail.value.name;
    //先进行表单非空验证
    if (name == "") {
      postError(that, "请输入课程名");
      return;
    } 
    var creatMan = app.globalData.userDataBaseInfo['name'];
    var term = "" + (parseInt(year) - 1 + parseInt(that.data.termIndex)) + ( that.data.termIndex ==0?2:1);
    var isXX = that.data.peopleHide;
    var content = e.detail.value.content;
  
    classInfo["name"] = name
    classInfo["createMan"] = creatMan
    classInfo["term"] = term
    classInfo["isXX"] = isXX
  
    if(that.data.isSrc)
      classInfo["picSrc"] = that.data.src


       if(!isXX){///不是选修
                     //0.校验班级是否空
         if (that.data.claList.length==0) {
             postError(that,"至少添加一个班级");
             return;
         }
         var typeIndex = this.data.typeIndex;//1.学院序号
         classInfo["collegeNum"] = typeIndex
         var claList =[];  //2.班级泪飙
         for(var i = 0 ;i<that.data.claList.length;i++ )
            claList[i] = that.data.claList[i].id
         classInfo["claList"] = claList
       }
       else{  //是选秀
         var peoplenum = e.detail.value.peoplenum;
         if (peoplenum==""){
           postError(that, "请输入人数上限");
           return;
         }
         classInfo["peoplenum"] = peoplenum
       }

    if (content == "") {
      postError(that, "请填写课程描述");
      return;
    } 
    classInfo["content"] = content
    
      console.log('校验完毕');
      that.setData({
        isLoading: true,
        isdisabled: true
      })

    //数据再加工
    if (classInfo['isXX']) {
      classInfo['collegeNum'] = -1
      classInfo['claList'] = []
    }
    else {
      classInfo['peoplenum'] = classInfo['claList'].length * 60
    }
  

    //---校验完成  提交数据     
   


    if (that.data.isSrc) {
      FILE.uploadPic(classInfo['picSrc'][0],
        "image/courseImage/", //云路径
        '' +uuid,//名字
        function (url) {  //上传后
          classInfo['url']=url
          addCourse(that, classInfo)
        }
      )
    }
    else{
      classInfo['url'] ='https://636c-cloudclassroom-7d6098-1258597894.tcb.qcloud.la/image/courseImage/1927114.jpg'
      addCourse(that, classInfo)
    }




  

  }

  //****************************************** */

})






//------------ ----------- ----sql ------------------- -----------
//--------------------------sql添加
function addCourse(that,courseInfo) {
  console.log(courseInfo)

  //插曲course
  SQL.addSQLPlus1('course', {
    uuid:uuid,
    name: courseInfo['name'],
    createMan: courseInfo['createMan'],
    createManId: app.globalData.userDataBaseInfo['_id'],
    createdate: year + '-' + month + '-' + day,
    peoplenum: courseInfo['peoplenum'],
    claList: courseInfo['claList'],
    collegeNum: courseInfo['collegeNum'],
    content: courseInfo['content'],
    term: courseInfo['term'],
    url: courseInfo['url'],
    isXX: courseInfo['isXX'],
    isSigning:false
  },
    function (id) {
      wx.showToast({
        title: '创建成功',
      })
      var list = courseInfo['claList']
      for (var i = 0; i < list.length;i++){
         SQL.addSQL('cla_course',{
            cla_id : list[i],
           course_id: id
         })
      }
      console.log('正在建立班级_课程连接。。。共-'+list.length+"-条")

      wx.switchTab({
        url: '../index/index',
      })

    }
  )



}



//--------------------------sql查找

//------------------------------上getUUID
function getUUID(that){
   SQL.query('course',{
     uuid:uuid
   },
   function(res){
     if(res.data.length!=0){
        date = new Date;
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate()     
        uuid = "" + year % 100 + month + day + date.getHours() + date.getMinutes()+uuNum
        uuNum = uuNum + 1
      //  var str=uuis.substring(,)              /**BUUUUGGGGGGGGGGGGGGGGGGGGGGG */
       getUUID(that)
     }
   })
}


function  postError(that,content){
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



