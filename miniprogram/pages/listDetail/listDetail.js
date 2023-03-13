import request from "../../utils/request"
import pusub from 'pubsub-js'
const db=wx.cloud.database();
var dayjs=require('../../miniprogram_npm/dayjs/index')
let timeI=''//定时器，用来获取当前播放的id
let time=''
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playList:[],
    listInfor:{},
    playingId:-1,
    bgUrl:"", // 换成你自己的背景图链接就行
    userSongList:[],//用户歌单数据
    isShow:false,//添加歌单弹窗默认不显示
    songIndex:-1,//用于保存当前用户点击需要收藏的歌曲的下标
    userInfor:{},//网易用户信息
    topNum: 0,
    index:-1,

    //简易播放器模块数据
    isPlay:true,
    isPlaying:false,
    singer:"",
    mname:"",
    picUrl:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let id=options.id
    this.getInfor(id)
    if(wx.getStorageSync('loginMode')==1)
    {
      let userInfor=wx.getStorageSync('userInfor');
      if(userInfor)
      {
        this.setData({
          userInfor:JSON.parse(userInfor)
        })
      }
    }
  },

   //显示用户自建歌单
  async more(e){
    if(wx.getStorageSync('isLogin'))//已经登录
    {
      if(wx.getStorageSync('loginMode')==1)//网易用户
      {
        let uid=this.data.userInfor.userId
        let index=e.currentTarget.dataset.index
        wx.cloud.callFunction({
          name:'getUserSongList',
          data:{
            uid:String(uid)
          }
        }).then(res=>{
          if(res.result.data.length==0)//当前用户没有任何歌单
          {
            wx.showToast({
              title: '抱歉，您暂时没有任何歌单',
              icon:'none'
            })
            return ;
          }else{
            this.setData({
              userSongList:res.result.data,
              isShow:true,
              index //存下需要添加至歌单的歌曲下标
            })
          }
        })
      }
      else if(wx.getStorageSync('loginMode')==2)//微信用户
      {
        let uid=wx.getStorageSync('openId')
        let index=e.currentTarget.dataset.index
        wx.cloud.callFunction({
          name:'getUserSongList',
          data:{
            uid:uid
          }
        }).then(res=>{
          if(res.result.data.length==0)//当前用户没有任何歌单
          {
            wx.showToast({
              title: '抱歉，您暂时没有任何歌单',
              icon:'none'
            })
            return ;
          }else{
            this.setData({
              userSongList:res.result.data,
              isShow:true,
              index
            })
          }
        })
      }
    }else{
      wx.showToast({
        title: '抱歉，先登录之后才能添加到歌单~',
        icon:'none'
      })
    }
  },

  //进行添加歌单功能
  async addMyList(e){
    let listIndex=e.currentTarget.dataset.index //拿到当前用户所选的歌单
    let listName=this.data.userSongList[listIndex].listName
    let coverImgUrl=this.data.playList[this.data.index].al.picUrl//更新个人歌单背景图
    let mId=this.data.playList[this.data.index].id
//    console.log(listName)
//    console.log(coverImgUrl)
    let time=new Date()
    let addTime=dayjs(time).format("YYYY-MM-DD HH:mm:ss")
    if(wx.getStorageSync('loginMode')==1)//网易用户
    {
      let re=await request('/song/url',{id:this.data.playList[this.data.index].id});
      if(re.data[0].url==null)
      {
        wx.showToast({
          title: '十分抱歉，该歌曲暂无版权，试试别的音乐吧~',
          icon:'none'
        })
        this.setData({
          isShow:false
        })
        return ;
      }
      wx.cloud.callFunction({
        name:'isAddList',
        data:{
          uid:String(this.data.userInfor.userId),
          mId:String(mId),
          listName:String(listName)
        }
      }).then(res=>{
        console.log(res)
        if(res.result.data.length==0)//当前歌曲没被该用户添加到该歌单
        {
          wx.cloud.callFunction({
            name:'addToList',
            data:{
              mId:String(this.data.playList[this.data.index].id),
              listName:listName,
              uid:String(this.data.userInfor.userId),
              mname:String(this.data.playList[this.data.index].name),
              singer:String(this.data.playList[this.data.index].ar[0].name),
              addTime:addTime
            }
          }).then(res=>{
            console.log("用户歌单歌曲添加完成")
            wx.showLoading({
              title: '添加中。。。',
            })
            wx.cloud.callFunction({
              name:'upCoverImg',
              data:{
                uid:String(this.data.userInfor.userId),
                listName:listName,
                coverImgUrl:coverImgUrl
              }
            }).then(res=>{
              console.log("用户歌单背景图更新完成")
              wx.hideLoading()
              wx.showToast({
                title: '添加成功！',
                icon:'none'
              })
              this.setData({
                isShow:false
              })
            })
          })
        }else{
          wx.showToast({
            title: '歌曲已存在！',
            icon:'none'
          })
        }
      })
    }
    else if(wx.getStorageSync('loginMode')==2)
    {
      let re=await request('/song/url',{id:this.data.playList[this.data.index].id});
      if(re.data[0].url==null)
      {
        wx.showToast({
          title: '抱歉，版权原因暂无歌曲',
          icon:'none'
        })
        this.setData({
          isShow:false
        })
        return ;
      }
      //else 当前歌曲有url则进行添加
      wx.cloud.callFunction({
        name:'isAddList',
        data:{
          uid:String(wx.getStorageSync('openId')),
          mId:String(mId),
          listName:String(listName)
        }
      }).then(res=>{
        console.log(res)
        if(res.result.data.length==0)//当前歌曲没被该用户添加到该歌单
        {
          wx.cloud.callFunction({
            name:'addToList',
            data:{
              mId:String(this.data.playList[this.data.index].id),
              listName:listName,
              uid:String(wx.getStorageSync('openId')),
              mname:String(this.data.playList[this.data.index].name),
              singer:String(this.data.playList[this.data.index].ar[0].name),
              addTime:addTime
            }
          }).then(res=>{
            console.log("用户歌单歌曲添加完成")
            wx.cloud.callFunction({
              name:'upCoverImg',
              data:{
                uid:String(wx.getStorageSync('openId')),
                listName:listName,
                coverImgUrl:coverImgUrl
              }
            }).then(res=>{
              console.log("用户歌单背景图更新完成")
              wx.showToast({
                title: '添加成功！',
                icon:'none'
              })
              this.setData({
                isShow:false
              })
            })
          })
        }else{
          wx.showToast({
            title: '歌曲已存在！',
            icon:'none'
          })
        }
      })
    }
  },

  async getUrl(mid)
  {
    let res=await request('/song/url',{id:mid});
    return res
  },

  async onSelect(e){
    console.log(e)
    this.setData({
      playingId:e.currentTarget.dataset.musicid
    })
    let url=await request('/song/url',{id:e.currentTarget.dataset.musicid})
    if(url.data[0].url==null)//没版权音乐
    {
      wx.showToast({
        title: '暂无音乐数据，换下一首',
        icon:'none'
      })
      return ;
    }
    let index=e.currentTarget.dataset.index;
    let idList=[];
  //  wx.setStorageSync('playId',e.currentTarget.dataset.musicid);//number类型
    this.data.playList.map(item=>{
      idList.push(item.id);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
  },

  async suiPlay(){
    let index=parseInt(Math.random()*this.data.playList.length);
    this.setData({
      playingId:this.data.playList[index].id
    })
    let url=await request('/song/url',{id:this.data.playList[index].id})
    if(url.data[0].url==null)
    {
      this.suiPlay()
      return ;
    }
    let idList=[];
    this.data.playList.map(item=>{
      idList.push(item.id);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
  },

  async getInfor(id){//获取歌单详情信息
    wx.showLoading({
      title: '加载中',
    })
    let res=await request('/playlist/detail',{id:id})
    console.log(res)
    if(res.playlist.tracks.length>20)
    {
      console.log("列表歌曲长度大于20首歌曲")
      let playList=[]
      for(let i=0;i<20;i++)//只拿20首
      {
        playList.push(res.playlist.tracks[i])
      }
      wx.hideLoading()
      this.setData({
        listInfor:res.playlist,
        playList:playList
      })
    }else
    {
      wx.hideLoading()
      this.setData({
        listInfor:res.playlist,
        playList:res.playlist.tracks
      })
    }
  },

  /** 
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

    // 获取滚动条当前位置
  onPageScroll: function (e) {
      if (e.scrollTop > 100) {
        this.setData({
          floorstatus: true
        });
      } else {
        this.setData({
          floorstatus: false
        });
      }
  },
  
    //回到顶部
  goTop: function (e) {  // 一键回到顶部
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let id=wx.getStorageSync('playId')
    if(id)//如果id存在
    {
      this.setData({
        playingId:Number(id)
      })
    }
    timeI=setInterval(()=>{
      this.setData({
        playingId:wx.getStorageSync('playId')
      })
    },1000)
    if(app.globalData.isPlaying===true)
    {
      time=setInterval(()=>{
        this.setData({
          isPlaying:app.globalData.isPlaying,
          singer:app.globalData.singer,
          picUrl:app.globalData.picUrl,
          mname:app.globalData.mname,
          isPlay:app.globalData.isPlay
        })
      },1000)
    }
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
  //  console.log("页面销毁，定时器销毁")
    clearInterval(timeI);//销毁计时器
    clearInterval(time);
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