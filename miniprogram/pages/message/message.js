
Page({
  data:{
    // text:"这是一个页面"
    focus:false,
    isShowView:true,
    messages:[
      {
        title:"我的云课堂",
        url:"/static/images/icon/icon.png",
        message:"我会提醒你上课签到哦。",
        time:"21:15",
        count:0
      },
      {
        title:"系统消息",
        url:"/static/images/icon/icon1.png",
        message:"欢迎使用高校云课堂，祝你学习进步！",
        time:"14:23",
        count:0
      }
    ]
  },
  bindtap:function(event){
wx.navigateTo({
  url: "search/search"
})
  },
  bindfocus:function(){
    this.setData({
         focus:true
    })
    this.setData({
      isShowView:false
    })
  },
  bindblur:function(){

          this.setData({
      focus:false
    })
    this.setData({
           isShowView:true
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})