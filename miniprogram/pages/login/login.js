var dayjs=require('../../miniprogram_npm/dayjs/index')
import request from "../../utils/request"
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'', //登录账号(手机号)
    password:'', //登录密码
    openId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenId()
  },
  async getOpenId(){
    let openId=await getApp().getCloudOpenid()
    this.setData({
      openId
    })
  },
  /* 登录表单逻辑代码 */
  handInput(event)
  {
    let tmp=event.currentTarget.id;
    this.setData({
      [tmp]:event.detail.value
    })
  },

  //登录功能(网易云方式登录)
  async  login(){
    let{phone,password}=this.data;
    if(!phone){
      wx.showToast({
        title: '手机号不可为空！',
        icon:'none'
      })
      return ;
    }
    //正则表达式
    let phonetmp=/^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phonetmp.test(phone)){
      wx.showToast({
        title: '手机号格式不正确！',
        icon:'none'
      })
      return ;
    }
    if(!password)
    {
      wx.showToast({
        title: '密码不可为空！',
        icon:'none'
      })
      return ;
    }
    wx.showToast({
      title: '验证通过，登陆中',
      icon:'loading'
    })

    let offTime=app.globalData.offTime//拿到该用户上一次注销账户操作的总时间
    if(offTime.length!==0)//拿到数据，说明有过注销动作
    {
      let now=-1
      let off=-1
      let offH=[]
      let offF=[]
      let offS=[]
      for(let i=0;i<=1;i++)
      {
        offH.push(parseInt(offTime[i]))//转换为整型后入栈,时
      }
      for(let i=3;i<=4;i++)
      {
        offF.push(parseInt(offTime[i]))//转换为整型后入栈，分
      }
      for(let i=6;i<=7;i++)
      {
        offS.push(parseInt(offTime[i]))//转换为整型后入栈，秒
      }
      let date=new Date()
      let nowTime=dayjs(date).format("HH:mm:ss")
      let nowH=[]
      let nowF=[]
      let nowS=[]
      for(let i=0;i<=1;i++)
      {
        nowH.push(parseInt(nowTime[i]))//转换为整型后入栈,时
      }
      for(let i=3;i<=4;i++)
      {
        nowF.push(parseInt(nowTime[i]))//转换为整型后入栈，分
      }
      for(let i=6;i<=7;i++)
      {
        nowS.push(parseInt(nowTime[i]))//转换为整型后入栈，秒
      }
      off=(offH[0]*10+offH[1])*3600+(offF[0]*10+offF[1])*60+(offS[0]*10+offS[1])//换为秒为单位
      now=(nowH[0]*10+nowH[1])*3600+(nowF[0]*10+nowF[1])*60+(nowS[0]*10+nowS[1])//换为秒为单位
      if((now-off)<=300)//本次登录操作距离上次登录操作间隔没有到5分钟
      {
        app.globalData.noLogin=true
        wx.switchTab({
          url: `/pages/person/person`,
        })
      }else{
        app.globalData.noLogin=false
        let res=await request('/login/cellphone',{phone,password})
        console.log(res)
        if(res.code===200){
          wx.showToast({
            title: '登录成功！',
            icon:'success'
          })
          wx.setStorageSync('userInfor', JSON.stringify(res.profile))
          wx.setStorageSync('loginMode', 1)//网易用户登录标志为1
          wx.setStorageSync('isLogin',true)//标志当前已有用户登录
          //登录成功跳转至个人页面
          wx.switchTab({
            url: '/pages/person/person',
          })
        }else if(res.code===400){
          wx.showToast({
            title: '手机号错误！',
            icon:'none'
          })
        }else if(res.code===502){
          wx.showToast({
            title: '密码错误！',
            icon:'none'
          })
        }else{
          wx.showToast({
            title: '发生了未知错误！请重新登录',
            icon:'none'
          })
        }
        }
    }else{//第一次登录
      app.globalData.noLogin=false
      let res=await request('/login/cellphone',{phone,password})
        console.log(res)
        if(res.code===200){
          wx.showToast({
            title: '登录成功！',
            icon:'success'
          })
          wx.setStorageSync('userInfor', JSON.stringify(res.profile))
          wx.setStorageSync('loginMode', 1)//网易用户登录标志为1
          wx.setStorageSync('isLogin',true)//标志当前已有用户登录
          //登录成功跳转至个人页面
          wx.switchTab({
            url: '/pages/person/person',
          })
        }else if(res.code===400){
          wx.showToast({
            title: '手机号错误！',
            icon:'none'
          })
        }else if(res.code===502){
          wx.showToast({
            title: '密码错误！',
            icon:'none'
          })
        }else{
          wx.showToast({
            title: '发生了未知错误！请重新登录',
            icon:'none'
          })
        }
    }
  },

  async wechatLogin(){//微信登录方式

    let offTime=app.globalData.offTime//拿到该用户上一次注销账户操作的总时间
    if(offTime.length!==0)//拿到数据，说明有过注销动作
    {
      let now=-1
      let off=-1
      let offH=[]
      let offF=[]
      let offS=[]
      for(let i=0;i<=1;i++)
      {
        offH.push(parseInt(offTime[i]))//转换为整型后入栈,时
      }
      for(let i=3;i<=4;i++)
      {
        offF.push(parseInt(offTime[i]))//转换为整型后入栈，分
      }
      for(let i=6;i<=7;i++)
      {
        offS.push(parseInt(offTime[i]))//转换为整型后入栈，秒
      }
      let date=new Date()
      let nowTime=dayjs(date).format("HH:mm:ss")
      let nowH=[]
      let nowF=[]
      let nowS=[]
      for(let i=0;i<=1;i++)
      {
        nowH.push(parseInt(nowTime[i]))//转换为整型后入栈,时
      }
      for(let i=3;i<=4;i++)
      {
        nowF.push(parseInt(nowTime[i]))//转换为整型后入栈，分
      }
      for(let i=6;i<=7;i++)
      {
        nowS.push(parseInt(nowTime[i]))//转换为整型后入栈，秒
      }
      off=(offH[0]*10+offH[1])*3600+(offF[0]*10+offF[1])*60+(offS[0]*10+offS[1])//换为秒为单位
      now=(nowH[0]*10+nowH[1])*3600+(nowF[0]*10+nowF[1])*60+(nowS[0]*10+nowS[1])//换为秒为单位
      if((now-off)<=300)//本次登录操作距离上次登录操作间隔没有到5分钟
      {
        app.globalData.noLogin=true
        wx.switchTab({
          url: `/pages/person/person`,
        })
      }else{
        wx.getUserProfile({
          desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log(res)
            wx.setStorageSync('loginMode',2)//修改登陆模式
            wx.setStorageSync('isLogin',true)//
            wx.setStorageSync('userInfor',JSON.stringify(res.userInfo))
            wx.setStorageSync('openId',this.data.openId)//保存当前用户的openid
            if(this.data.openId==="") //可以放你自己的openid作为唯一管理员标记
            {
              wx.setStorageSync('isRoot',true)//管理员标记
              let phone="";//获取到cookie，方便一些功能的使用
              let password="";
              this.login_w(phone,password)
            }else{//用作普通微信用户拿取cookie
              let phone="";//获取到cookie，方便一些功能的使用
              let password="";
              this.login_w(phone,password)
            }
            wx.switchTab({
              url: '/pages/person/person',
            }) 
          },
          fail: (err)=>{
            wx.showToast({
              title: '需要授权部分功能才能使用哦~',
              icon:'none'
            })
          } 
        })
      }
    }else{
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
  //        console.log(res)
          wx.setStorageSync('loginMode',2)//修改登陆模式
          wx.setStorageSync('isLogin',true)//
          wx.setStorageSync('userInfor',JSON.stringify(res.userInfo))
          wx.setStorageSync('openId',this.data.openId)//保存当前用户的openid
          if(this.data.openId==="") //这里可以放你自己的微信唯一标识id
          {
            wx.setStorageSync('isRoot',true)//管理员标记
            let phone="";//获取到cookie，方便一些功能的使用 这里需要你手动填写一个网易云音乐的账号的手机和密码，项目用的是同一个人的数据，所以得自己是手动添加，以当做是管理员
            let password="";
            this.login_w(phone,password)
          }else{//用作普通微信用户拿取cookie
            let phone="";//获取到cookie，方便一些功能的使用
            let password="";
            this.login_w(phone,password)
          }
          wx.switchTab({
            url: '/pages/person/person',
          }) 
        },
        fail: (err)=>{
          wx.showToast({
            title: '需要授权部分功能才能使用哦~',
            icon:'none'
          })
        } 
      })
    }
     
  },
  
  async login_w(phone,password){
    let res=await request('/login/cellphone',{phone,password})
  //  console.log(res)
    wx.setStorageSync('userInfor_tmp', JSON.stringify(res.profile))
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})