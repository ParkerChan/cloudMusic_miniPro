import request from "../../utils/request"
import pusub from 'pubsub-js'
const db=wx.cloud.database();
var dayjs=require('../../miniprogram_npm/dayjs/index')
var app=getApp()
let time=''

// let logflag=false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfor:{},//获取用户信息
    openId:"",//用户的唯一标识
    rcentSongList:[],//获取用户播放记录
 //   songList:[],//用户的歌单
    loginMode:0,//默认未登录
    songListII:[],
    url0:"",//游客 换你自己想要的图片，放路径就行
    url1:"",//微信用户
    showCreatList:false,
    showSaying:false,
    value:"",
    coverImgUrl:"",
    isRoot:false,
    showGongGao:false,
    //输入框
    valueI:"",
    valueII:"",
    value_user:"",
    value_title:"",
    //歌单操作列表
    showListMore:false,
    actions: [
      {
        name: '删除歌单',
      },
      {
        name: '更名',
      },
      {
        name: '取消',
      },
    ],
    listName_sle:"",
    showUpListName:false,
    value_titleN:"",

    //简易播放器模块数据
    isPlay:true,
    isPlaying:false,
    singer:"",
    mname:"",
    picUrl:""
  },

  //歌单操作
  listMore(e){
  //  console.log(e)
    this.setData({
      listName_sle:e.currentTarget.dataset.listname_sle,//保存用户所选的歌单名称，
      showListMore:true//展示歌单操作弹窗
    })
  },

  //歌单操作
  onCloseII() {
    this.setData({ showListMore: false });
  },

  //歌单操作
  onSelectII(event) {
  //  console.log(event.detail);
    let that=this
    if(event.detail.name==="取消")
    {
      that.setData({
        showListMore:false
      })
    }else if(event.detail.name==="删除歌单")
    {
      if(wx.getStorageSync('loginMode')===1)//网易用户
      {
        let that=this
        wx.showModal
          ({//使用API实现确认框的功能
          title:"提示",
          content:"要删除歌单吗？",
          success(sm)
          {
            if(sm.confirm)
            {
              wx.cloud.callFunction({
                name:'delSongList',
                data:{
                  uid:String(that.data.userInfor.userId),
                  listName:String(that.data.listName_sle)
                }
              }).then(res=>{
                if(res.result.stats.removed===1)//歌单删除成功
                {
                  wx.cloud.callFunction({
                    name:'delSongListDta',
                    data:{
                      uid:String(that.data.userInfor.userId),
                      listName:String(that.data.listName_sle)
                    }
                  }).then(res=>{
                    wx.showToast({
                      title: '删除成功',
                      icon:'success'
                    })
                    that.onShow()
                  })
                }else{
                  wx.showToast({
                    title: '删除失败，请稍候重试',
                    icon:'none'
                  })
                  that.onShow()
                }
              })
          }else if(sm.cancel){
 //           console.log("取消了")
            that.setData({
              showListMore:true
            })
          }
          }
        })
      }else if(wx.getStorageSync('loginMode')===2)
      {
        let that=this
        wx.showModal
          ({//使用API实现确认框的功能
          title:"提示",
          content:"要删除歌单吗？",
          success(sm)
          {
            if(sm.confirm)
            {
              wx.cloud.callFunction({
                name:'delSongList',
                data:{
                  uid:String(wx.getStorageSync('openId')),
                  listName:String(that.data.listName_sle)
                }
              }).then(res=>{
                if(res.result.stats.removed===1)//歌单删除成功
                {
                  wx.cloud.callFunction({
                    name:'delSongListDta',
                    data:{
                      uid:String(wx.getStorageSync('openId')),
                      listName:String(that.data.listName_sle)
                    }
                  }).then(res=>{
                    wx.showToast({
                      title: '删除成功',
                      icon:'success'
                    })
                    that.onShow()
                  })
                }else{
                  wx.showToast({
                    title: '删除失败，请稍候重试',
                    icon:'none'
                  })
                  that.onShow()
                }
              })
          }else if(sm.cancel){
 //           console.log("取消了")
            that.setData({
              showListMore:true
            })
          }
          }
        })
      }
    }else if(event.detail.name==="更名")
    {
      this.setData({
        showUpListName:true
      })
    }
  },

  //更新歌单名称
  UpSongListName(e){
  //  console.log(e)
    let listNameN=e.detail.value.listNameN
    let that=this
    if(listNameN===this.data.listName_sle)
    {
      wx.showToast({
        title: '不能与旧名相同！',
        icon:'none'
      })
      this.setData({
        value_titleN:""
      })
      return ;
    }
    else if(listNameN===""){
      wx.showToast({
        title: '名字不能为空！',
        icon:'none'
      })
      this.setData({
        value_titleN:""
      })
      return ;
    }
    else if(listNameN!==""){
      for(let i=0;i<that.data.songListII.length;i++)
      {
        if(listNameN===that.data.songListII[i].listName)
        {
          wx.showToast({
            title: '名称已存在！',
            icon:'none'
          })
          this.setData({
            value_titleN:""
          })
          return ;
        }
      }
      if(wx.getStorageSync('loginMode')===1)
      {
        wx.cloud.callFunction({
          name:'upSongListName',
          data:{
            listName:String(that.data.listName_sle),
            uid:String(that.data.userInfor.userId),
            listNameN:String(listNameN)
          }
        }).then(res=>{
          if(res.result.stats.updated===1)
          {
            wx.cloud.callFunction({
              name:'upSongListNameDta',
              data:{
                listName:String(that.data.listName_sle),
                uid:String(that.data.userInfor.userId),
                listNameN:String(listNameN)
              }
            }).then(res=>{
              wx.showToast({
                title: '改名成功',
                icon:'success'
              })
              this.setData({
                showUpListName:false,
                value_titleN:""
              })
              that.onShow()
            })
          }else{
            wx.showToast({
              title: '改名失败，请稍候重试',
              icon:'none'
            })
            this.setData({
              showUpListName:false,
              value_titleN:""
            })
            that.onShow()
          }
        })
      }else if(wx.getStorageSync('loginMode')===2)
      {
        wx.cloud.callFunction({
          name:'upSongListName',
          data:{
            listName:String(that.data.listName_sle),
            uid:String(wx.getStorageSync('openId')),
            listNameN:String(listNameN)
          }
        }).then(res=>{
          if(res.result.stats.updated===1)
          {
            wx.cloud.callFunction({
              name:'upSongListNameDta',
              data:{
                listName:String(that.data.listName_sle),
                uid:String(wx.getStorageSync('openId')),
                listNameN:String(listNameN)
              }
            }).then(res=>{
              wx.showToast({
                title: '改名成功',
                icon:'success'
              })
              this.setData({
                showUpListName:false,
                value_titleN:""
              })
              that.onShow()
            })
          }else{
            wx.showToast({
              title: '改名失败，请稍候重试',
              icon:'none'
            })
            this.setData({
              showUpListName:false,
              value_titleN:""
            })
            that.onShow()
          }
        })
      }
    }
    else{
      if(wx.getStorageSync('loginMode')===1)
      {
        wx.cloud.callFunction({
          name:'upSongListName',
          data:{
            listName:String(that.data.listName_sle),
            uid:String(that.data.userInfor.userId),
            listNameN:String(listNameN)
          }
        }).then(res=>{
          if(res.result.stats.updated===1)
          {
            wx.cloud.callFunction({
              name:'upSongListNameDta',
              data:{
                listName:String(that.data.listName_sle),
                uid:String(that.data.userInfor.userId),
                listNameN:String(listNameN)
              }
            }).then(res=>{
              wx.showToast({
                title: '改名成功',
                icon:'success'
              })
              this.setData({
                showUpListName:false,
                value_titleN:""
              })
              that.onShow()
            })
          }else{
            wx.showToast({
              title: '改名失败，请稍候重试',
              icon:'none'
            })
            this.setData({
              showUpListName:false,
              value_titleN:""
            })
            that.onShow()
          }
        })
      }else if(wx.getStorageSync('loginMode')===2)
      {
        wx.cloud.callFunction({
          name:'upSongListName',
          data:{
            listName:String(that.data.listName_sle),
            uid:String(wx.getStorageSync('openId')),
            listNameN:String(listNameN)
          }
        }).then(res=>{
          if(res.result.stats.updated===1)
          {
            wx.cloud.callFunction({
              name:'upSongListNameDta',
              data:{
                listName:String(that.data.listName_sle),
                uid:String(wx.getStorageSync('openId')),
                listNameN:String(listNameN)
              }
            }).then(res=>{
              wx.showToast({
                title: '改名成功',
                icon:'success'
              })
              this.setData({
                showUpListName:false,
                value_titleN:""
              })
              that.onShow()
            })
          }else{
            wx.showToast({
              title: '改名失败，请稍候重试',
              icon:'none'
            })
            this.setData({
              showUpListName:false,
              value_titleN:""
            })
            that.onShow()
          }
        })
      }
    }
  },

  //新建歌单的表单显示  
  showCreatSongList(){
    this.setData({
      showCreatList:true
    })
  },

  dialogOnClose(){
  //  console.log("关闭弹窗")
  this.setData({
    value_title:"",
    value_user:""
  })
  },

  showSay(){
    this.setData({
      showSaying:true
    })
  },
  //公告
  showSendMes(){
    this.setData({
      showGongGao:true
    })
  },

  //管理员发布公告模块
  sendMes(e){
    console.log(e)
    let title=e.detail.value.title
    let content=e.detail.value.content
    let time=new Date()
    console.log(time)
    let messageTime=dayjs(time).format("YYYY-MM-DD HH:mm:ss")
    wx.cloud.callFunction({
      name:'rootMessage',
      data:{
        pic:String(this.data.userInfor.avatarUrl),
        name:String(this.data.userInfor.nickName),
        uid:String(wx.getStorageSync('openId')),
        title,
        content,
        messageTime
      }
    }).then(res=>{
      wx.showToast({
        title: '公告发布成功',
        icon:'success'
      })
      this.setData({
        showGongGao:false,
        valueI:"",
        valueII:""
      })
    })
  },

  //用户留言模块
  userSay(e){
    let content=e.detail.value.content//保存用户评价
    let time=new Date()
    console.log(time)
    let sendTime=dayjs(time).format("YYYY-MM-DD,HH:mm:ss")
    if(content.length===0)
    {
      wx.showToast({
        title: '内容不能为空！',
        icon:'none'
      })
    }
    if(wx.getStorageSync('loginMode')==1)
    {
      wx.cloud.callFunction({
        name:'addToUserSay',
        data:{
          uid:String(this.data.userInfor.userId),
          content:content,
          userName:String(this.data.userInfor.nickname),
          picUrl:String(this.data.userInfor.avatarUrl),
          sendTime
        }
      }).then(res=>{
        wx.showToast({
          title: '感谢您的反馈',
          icon:'success'
        })
        this.setData({
          showSaying:false,
          value_user:""
        })
      })
    }else if(wx.getStorageSync('loginMode')==2)
    {
      wx.cloud.callFunction({
        name:'addToUserSay',
        data:{
          uid:String(wx.getStorageSync('openId')),
          content:content,
          userName:String(this.data.userInfor.nickName),
          picUrl:String(this.data.userInfor.avatarUrl),
          sendTime
        }
      }).then(res=>{
        wx.showToast({
          title: '感谢您的反馈',
          icon:'success'
        })
        this.setData({
          showSaying:false
        })
      })
    }
  },

  //新建歌单模块
  createSongList(e){
    if(this.data.loginMode==2)
    {
      let listName=String(e.detail.value.listName);
      let uid=String(wx.getStorageSync('openId'))
      wx.cloud.callFunction({
        name:'findUserSongList',
        data:{
          uid:uid,
          listName:listName
        }
      }).then(res=>{
        if(res.result.data.length==0)//没有该歌单
        {
          wx.cloud.callFunction({
            name:'creatUserSongList',
            data:{
              uid:uid,
              listName:listName,
              coverImgUrl:this.data.coverImgUrl //新建歌单默认图片
            }
          }).then(res=>{
            console.log("歌单新建成功！")
            wx.showToast({
              title: '歌单新建成功！',
              icon:'success'
            })
            this.setData({
              showCreatList:false,
              value_title:""
            })
            this.onShow()
          })
        }
        else if(res.result.data.length==10)
        {
          console.log("歌单新建失败！")
            wx.showToast({
              title: '歌单新建个数达上限！',
              icon:'none'
            })
            this.setData({
              showCreatList:false
            })
        }
        else
        {
          console.log("歌单新建失败！")
          wx.showToast({
            title: '歌单请勿重名！',
            icon:'none'
          })
        }
      })
    }else if(this.data.loginMode==1)
    {
      let listName=String(e.detail.value.listName);
      let uid=String(this.data.userInfor.userId)
      wx.cloud.callFunction({
        name:'findUserSongList',
        data:{
          uid:uid,
          listName:listName
        }
      }).then(res=>{
        if(res.result.data.length==0)//没有该歌单
        {
          wx.cloud.callFunction({
            name:'creatUserSongList',
            data:{
              uid:uid,
              listName:listName,
              coverImgUrl:this.data.coverImgUrl //新建歌单默认图片
            }
          }).then(res=>{
            console.log("歌单新建成功！")
            wx.showToast({
              title: '歌单新建成功！',
              icon:'success'
            })
            this.setData({
              showCreatList:false
            })
            this.onShow()
          })
        }
        else if(res.result.data.length==10)
        {
          console.log("歌单新建失败！")
            wx.showToast({
              title: '歌单新建个数达上限！',
              icon:'none'
            })
            this.setData({
              showCreatList:false
            })
        }
        else
        {
          console.log("歌单新建失败！")
          wx.showToast({
            title: '歌单请勿重名！',
            icon:'none'
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getOpenId()//获取到当前用户的openid
  },

  async getOpenId(){
    let openId=await getApp().getCloudOpenid()
    this.setData({
      openId
    })
  },

  //公告显示模块
  toMessage(){
    wx.navigateTo({
      url: '/pages/Message/Message',
    })
  },

  toLogin(){
  /*  if(!logflag)//未登录
    {
      wx.navigateTo({
        url: '/pages/login/login', 
      })
    } */
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
        wx.showToast({
          title: '请勿频繁登录！间隔为五分钟！',
          icon:'none'
        })
        return ;
      /*  wx.switchTab({
          url: `/pages/person/person`,
        }) */
      }else{
        wx.getUserProfile({
          desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log(res)
            wx.setStorageSync('loginMode',2)//修改登陆模式
            wx.setStorageSync('isLogin',true)//
            wx.setStorageSync('userInfor',JSON.stringify(res.userInfo))
            wx.setStorageSync('openId',this.data.openId)//保存当前用户的openid
            if(this.data.openId==="") 
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
          /*  wx.switchTab({
              url: '/pages/person/person',
            }) */
            this.onShow()
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
          if(this.data.openId==="") 
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
        /*  wx.switchTab({
            url: '/pages/person/person',
          }) */
          this.onShow()
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
  /*  console.log(res)
    if(app.globalData.songList.length===0)//未保存至全局
    {
      let resII=await request("/user/playlist",{uid:res.account.id})
      let id=resII.playlist[1].id
      let songList=await request('/playlist/detail',{id:id})
      console.log(songList)
      app.globalData.songList=songList.playlist.tracks
    } */
    wx.setStorageSync('userInfor_tmp', JSON.stringify(res.profile))
  },

  //注销登录
  toOff(){
    let that=this
    wx.showModal({
      title:'提示',
      content:'退出后五分钟才可登陆哦~',
      success(res){
        if(res.confirm)
        {
          if(that.data.loginMode==2)
     {
  //    logflag=false;
      that.setData({
        loginMode:0,
        userInfor:{},//全部清空
  //      songList:[],
        songListII:[],
        isRoot:false
      })
      //记录注销时间
      let date=new Date()
      let offTime=dayjs(date).format("HH:mm:ss")//记录下注销时间
      app.globalData.offTime=offTime//将用户注销时间存放到全局中
      wx.removeStorageSync('userInfor');
      wx.removeStorageSync('userInfor_tmp');
      wx.setStorageSync('loginMode',0);
      wx.setStorageSync('isLogin',false);
      wx.removeStorageSync('openId');  
      wx.removeStorageSync('isRoot');
      wx.removeStorageSync('cookies')  
    }/* else if(that.data.loginMode==1)
    {
      logflag=false;
      that.setData({
        loginMode:0,
        userInfor:{},//全部清空
   //     songList:[],
        songListII:[],
        isRoot:false
      })
      //记录注销时间
      let date=new Date()
      let offTime=dayjs(date).format("HH:mm:ss")//记录下注销时间
      app.globalData.offTime=offTime//将用户注销时间存放到全局中
      wx.removeStorageSync('userInfor');
      wx.setStorageSync('loginMode',0);
      wx.setStorageSync('isLogin',false);
      wx.removeStorageSync('cookies');
    } */
        }else if(res.cancel){
          wx.showToast({
            title: '那就继续使用吧~',
          })
        }
      }
    })
  },

  toSongPlay(){
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${app.globalData.index}&idList=${app.globalData.ids}`,
    })
  },

  pre(e){
    //发布消息
    let type="pre"
    pusub.publish('message',type)
  },

  play(e)
  {
    //发布消息
    let type="play"
    pusub.publish('message',type)
    this.setData({
      isPlay:!this.data.isPlay
    })
  },

  next(e)
  {
    //发布消息
    let type="next"
    pusub.publish('message',type)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  //获取歌单信息
  async getInfor(uid){
    if(this.data.loginMode==1)
    {
  /*    let res=await request("/user/playlist",{uid:uid})
      console.log(res)
      let songList=[]
      for(let i=0;i<res.playlist.length;i++)
      {
        if(res.playlist[i].subscribed==false)
        {
          songList.push(res.playlist[i])
        }
      }
      this.setData({
        songList
      }) */
      wx.cloud.callFunction({
        name:'getUserSongList',
        data:{
          uid:String(this.data.userInfor.userId)
        }
      }).then(res=>{
        this.setData({
          songListII:res.result.data
        })
      })
    }else if(this.data.loginMode==2)//微信用户模式
    {
      wx.cloud.callFunction({
        name:'getUserSongList',
        data:{
          uid:uid
        }
      }).then(res=>{
        this.setData({
          songListII:res.result.data
        })
      })
    }
  },

  cheak(e){ //这里的合法检测如果后面有时间就再完善一下
    if(e.detail.value.length>10)
    {
      wx.showToast({
        title: '抱歉，歌单名长度过长',
        icon:'none'
      })
    }else
    {
      for(let i=0;i<e.detail.value.length;i++)
      {
        if(e.detail.value[i]=="妈"||e.detail.value[i]=="爸"||e.detail.value[i]=="日"||e.detail.value[i]=="操")
        {
          wx.showToast({
            title: '抱歉，歌单名含敏感字',
            icon:'none'
          })
          this.setData({
            showCreatList:false
          })
        }else if(e.detail.value[i]=="傻" && i!=e.detail.value.length-1)
        {
          if(e.detail.value[i+1]=="逼" || e.detail.value[i+1]=="B")
          {
            wx.showToast({
              title: '抱歉，歌单名含敏感字',
              icon:'none'
            })
            this.setData({
              showCreatList:false
            })
          }
        }
      }
    }
  },

  onShow: function () {
    if(wx.getStorageSync('isLogin'))//当前有用户登录
    {
      let loginMode=wx.getStorageSync('loginMode')
      this.setData({
        loginMode
      })
      if(loginMode==1)//网易用户登录,则使用userId进行查询即可
      {
        let userInfor=wx.getStorageSync('userInfor');
        if(userInfor)
        {
          this.setData({
            userInfor:JSON.parse(userInfor)
          })
        //  logflag=true;
          userInfor=JSON.parse(userInfor)
          //获取当前用户的播放记录：
          wx.cloud.callFunction({
            name:'getRecentPlayList',
            data:{
              uid:String(userInfor.userId)//网易云提供的uerId不是字符型，转换一下
            }
          }).then(res=>{
            this.setData({
              rcentSongList:res.result.data
            })
          })
          this.getInfor(this.data.userInfor.userId)
        }
      }
      else if(this.data.loginMode==2){
        let userInfor=wx.getStorageSync('userInfor');
        if(userInfor)
        {
          this.setData({
            userInfor:JSON.parse(userInfor),
          })
          this.getInfor(wx.getStorageSync('openId'))
        }
        if(wx.getStorageSync('isRoot')==true)//是管理员
        {
          this.setData({
            isRoot:true
          })
        }
      }
    }
  /*  if(app.globalData.noLogin===true)
    { 
      app.globalData.noLogin=false
      wx.showToast({
        title: '请勿频繁登录，五分钟一次',
        icon:'none'
      })
    } */
    if(wx.getStorageSync('isRoot')===true)
    {
      
      wx.cloud.callFunction({
        name:'getAllCount',
        data:{
          userName:"微信用户"
        }
      }).then(res=>{
        let count=0
        for(let i=0;i<res.result.data.length;i++)
        {
          count+=res.result.data[i].bits
        }
        app.globalData.user_w=count
      })
      wx.cloud.callFunction({
        name:'getAllCount',
        data:{
          userName:"游客"
        }
      }).then(res=>{
        let count=0
        for(let i=0;i<res.result.data.length;i++)
        {
          count+=res.result.data[i].bits
        }
        app.globalData.user_y=count
      })

      //获取三种用户的最热三首歌曲
      wx.cloud.callFunction({
        name:'getUserCount',
        data:{
          userName:"微信用户"
        }
      }).then(res=>{
        app.globalData.hotlist_wbits[0]=res.result.data[0].bits
        app.globalData.hotlist_wbits[1]=res.result.data[1].bits
        app.globalData.hotlist_wbits[2]=res.result.data[2].bits
        app.globalData.hotlist_wname[0]=res.result.data[0].mname
        app.globalData.hotlist_wname[1]=res.result.data[1].mname
        app.globalData.hotlist_wname[2]=res.result.data[2].mname
      })
      wx.cloud.callFunction({
        name:'getUserCount',
        data:{
          userName:"游客"
        }
      }).then(res=>{
        app.globalData.hotlist_ybits[0]=res.result.data[0].bits
        app.globalData.hotlist_ybits[1]=res.result.data[1].bits
        app.globalData.hotlist_ybits[2]=res.result.data[2].bits
        app.globalData.hotlist_yname[0]=res.result.data[0].mname
        app.globalData.hotlist_yname[1]=res.result.data[1].mname
        app.globalData.hotlist_yname[2]=res.result.data[2].mname
      })

    }
      time=setInterval(()=>{
        this.setData({
          isPlaying:app.globalData.isPlaying,
          singer:app.globalData.singer,
          picUrl:app.globalData.picUrl,
          mname:app.globalData.mname,
          isPlay:app.globalData.isPlay
        })
      },1000)
  },

  //统计模块
  toStatistic(){
    wx.navigateTo({
      url: '/pages/statistic/statistic',
    })
  },

/*  toSongListDetail(e){
    console.log(e)
    let index=e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/listDetail/listDetail?id=${this.data.songList[index].id}`,
    })
  }, */
  
  toRoot(){
    wx.navigateTo({
      url: '/pages/Root/Root'
    })
  },

  toMyLike(){
    if(wx.getStorageSync('isLogin')===true)
    {
      wx.navigateTo({
        url: '/pages/myLike/myLike'
      })
    }
    else{
      wx.showToast({
        title: '请先登录哦~亲~',
        icon:'none'
      })
    }
  },

  toMyCount(){
    if(wx.getStorageSync('isLogin')===true)
    {
      wx.navigateTo({
        url: '/pages/myPlayCount/myPlayCount'
      })
    }else{
      wx.showToast({
        title: '请先登录哦~亲~',
        icon:'none'
      })
    }
    
  },

  toSongListDetailII(e){
  //  console.log(e)
    let index=e.currentTarget.dataset.index
    let listName=this.data.songListII[index].listName
    wx.navigateTo({
      url: `/pages/personList/personList?listName=${listName}`,
    }) 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
//    console.log("隐藏了")
//    clearInterval(time);
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