// pages/register/register.js
var app = getApp();
var userInfo = {};
var Bmob = require("../../utils/bmob.js");
const SQL = require("../../utils/SQL.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    college: [],
    typeIndex: "0",
    isAgree: false,
    TopTips: '',
    avatarUrl: ""
  },

  onLoad: function (options) {
   var that =this
   this.setData({
     avatarUrl: options.avatarUrl
   })
    getCollege(
      function(data){
        that.setData({
          college: data
        })
      }
    )////////
  //  that.setData({
  //    college:app.globalData.collegeList
  //  })

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
  //是否老师
  switch1Change : function(e){
     this.setData({
       isTeacher: e.detail.value
     })
  },
  //学院改变
  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  //同意相关条例
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length,
      showInput: !this.data.showInput
    });
  },
/*
添加班级操作
*/
addCla :function(res){
  var that = this
  var cla = res.detail.value
  var claReg = new RegExp("[1-9][0-9]{3}");
  if (cla != "" && cla.length == 4 && claReg.test(cla)){
    console.log("班级格式符合规范：正在进行入库操作！" + that.data.typeIndex+"&"+cla)

    SQL.addSQLPlus1('cla', {//班级参数
      claName: cla,
      collegeNum:  that.data. typeIndex
    },
    function(Claid){
          // console.log("!!!--", Claid)
          that.setData({ CLA: Claid})
    }
    )

  }
  else{
    // console.log(res.detail.value)
    return
  }

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
        content: '请先阅读并同意《用户须知》'
      })
      return;
    }

    var realname = e.detail.value.name;
    var sno = e.detail.value.sno;
    var cla = e.detail.value.cla;
    var typeIndex = this.data.typeIndex;  //学院序号
    var switchHide = e.detail.value.switchHide;//是否教授

//格式校验
    var nameReg = new RegExp("^[\u4e00-\u9fa5]{2,4}$");
    var snoReg =  new RegExp("[0-9]{8}");
    var claReg = new RegExp("[1-9][0-9]{3}");

    //先进行表单非空验证
     if(realname == "") {  
       postError(that, '请输入真实姓名') 
       return
     } else if (switchHide==false &&cla == "") {
       postError(that, '请输入班级')
       return
     } else if (switchHide == true) {
       cla='0000'
     } else if (sno == "") {
       postError(that, '请输入学号')
       return
    }  else if (realname != "" && !nameReg.test(realname)) {
       postError(that, '真实姓名一般为2-4位汉字')
       return
     } else if (cla != "" && cla.length != 4 && !claReg.test(cla)) {
       postError(that, '班级格式一般为4位数字(形如1603)')
       return
     } else if (sno != "" && sno.length !=8 && !snoReg.test(sno)) {
       postError(that, '学号格式一般为8位数字学号' )
       return
     } else 
      console.log('校验完毕');
    that.setData({  //封闭操作 等待执行
      isLoading: true,
      isdisabled: true
    })

     //---校验完成  栽入数据     


    userInfo['name'] = realname;
    userInfo['sno'] = sno;
    userInfo['college'] = typeIndex;
    userInfo['power'] = switchHide ? 1 : 2;
    userInfo['openId'] = app.globalData.openId;
    userInfo['avatarUrl'] = that.data.avatarUrl;

    //1.创建班级


if(that.data.CLA){
  addUser(that.data.CLA)
}
else{
  SQL.addSQLPlus1('cla', {//班级参数
    claName: cla,
    collegeNum: userInfo['college']
  },
    addUser
  )
}
  
    // userInfo['cla'] = cla;

    // console.log(userInfo)
    // addUser(userInfo)


  
  //****************************************** */

},

})


//------------ ----------- ----sql ------------------- -----------
//--------------------------sql添加


//--------------------------sql查找


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

function getCollege(f){
  const db = wx.cloud.database()
  // 查询当前用户所有的 counters
  db.collection('college').where({
    _id: 'XFUfjlsqTi00tmod'
  }).get({
    success: res => {
      // console.log(res.data[0].collegeArray)

      app.globalData.collegeList = res.data[0].collegeArray
      f(res.data[0].collegeArray)

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
}


/**
 *  开始添加用户
 */
function  addUser(cla) {   //2/完成后创建用户
  var that = this;
  userInfo['cla'] = cla;
  console.log(userInfo)
  SQL.addSQLPlus1('user',
    {  //用户参数字段
      name: userInfo['name'],
      sno: userInfo['sno'],
      pwd: userInfo['sno'],
      cla_id: userInfo['cla'],
      collegeNum: userInfo['college'],
      power: userInfo['power'],
      avatarUrl: userInfo['avatarUrl'],
      signIn: {}
    },
    function (user_id) {  //增加玩用户之后 
      app.globalData.userDataBaseInfo = SQL.query('user', { _id: user_id },
        function (res) {//查询到所增加的用户之后
          app.globalData.userDataBaseInfo = res.data[0]
          app.globalData.userPower = res.data[0]['power']
          wx.switchTab({
            url: '../index/index',
          })
        }
      )
    }

  )


}