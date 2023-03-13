import request from "../../utils/request"

const db=wx.cloud.database();
var app=getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:1,
    radio:'0',
    value:"",
    allSongList:[],//添加歌曲功能的歌曲列表
    delSongList:[],//删除歌曲的列表信息
    userSayList:[],//用户评价列表
    userInfor:{},//存放网易用户信息
    showAdd:false,
    mname:"",
    singer:"",
    type:0,//歌曲类型
    mId:"",
    topNum: 0,
    picUrl:"",
    title:"",

  },

  onClick(event) {
    this.setData({//拿到当前选中的下标和标题
      active:event.detail.index,
      title:event.detail.title
    })
    this.getInfor(this.data.title)
  },

  getInfor(title){
    if(title==="添加歌曲")
    {
      if(wx.getStorageSync('isRoot')===true)
      {
        let userInfor=wx.getStorageSync('userInfor_tmp')
          this.setData({
            userInfor:JSON.parse(userInfor)
          })
        if(app.globalData.songList.length===0)
        {
          console.log("歌曲列表未放入全局")
          this.getSong(this.data.userInfor.userId)
        }
        else{
          console.log("歌曲列表已放入全局")
          this.setData({
            allSongList:app.globalData.songList
          })
        }
      }
    }else if(title==="删除歌曲")
    {
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      wx.cloud.callFunction({
        name:'getAllSong'
      }).then(res=>{
        this.setData({
          delSongList:res.result.data
        })
      })
      wx.hideLoading()
    }else if(title==="用户评价")
    {
      wx.cloud.callFunction({
        name:'getAllUserSay'
      }).then(res=>{
        this.setData({
          userSayList:res.result.data
        })
      })
    }
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

  async getSong(uid){
    let res=await request("/user/playlist",{uid:uid})
//    console.log(res)
    if(wx.getStorageSync('loginMode')==2){
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      let songListId=res.playlist[1].id
      let resII=await request('/playlist/detail',{id:songListId})
      console.log(resII)
      this.setData({
        allSongList:resII.playlist.tracks
      })
      app.globalData.songList=resII.playlist.tracks
      wx.hideLoading()
    }
  },

  showAdd(e){
    this.setData({
      mname:this.data.allSongList[e.currentTarget.dataset.index].name,
      singer:this.data.allSongList[e.currentTarget.dataset.index].ar[0].name,
      mId:this.data.allSongList[e.currentTarget.dataset.index].id,
      picUrl:this.data.allSongList[e.currentTarget.dataset.index].al.picUrl
    })
    this.setData({
      showAdd:true
    })
  },

  addSong(){
    wx.cloud.callFunction({
      name:'findSongOfSongList',
      data:{
        mId:String(this.data.mId)
      }
    }).then(res=>{
      if(res.result.data.length==0)//当前歌曲没有在库中
      {
        wx.cloud.callFunction({
          name:'addToSongList',
          data:{
            mId:String(this.data.mId),
            mname:this.data.mname,
            singer:this.data.singer,
            type:Number(this.data.type),
            picUrl:String(this.data.picUrl)
          }
        }).then(res=>{
          wx.showToast({
            title: '添加完成',
            icon:'success'
          })
          this.setData({
            showAdd:false,
            radio:0
          })
        })
      }else{
        wx.showToast({
          title: '该歌曲已存在！',
          icon:'none'
        })
        this.setData({
          showAdd:false
        })
      }
    })
  },

  delSong(e){
    let mId=this.data.delSongList[e.currentTarget.dataset.index].mId
    let that=this
    wx.showModal
        ({//使用API实现确认框的功能
        title:"提示",
        content:"要删除该歌曲吗？",
        success(sm)
        {
          if(sm.confirm)
          {
          wx.cloud.callFunction({
            name:'delSong',
            data:{
                  mId:mId
                }
              }).then(res=>{
                console.log("删除成功")
                wx.cloud.callFunction({
                  name:'getAllSong'
                }).then(res=>{
                  that.setData({
                    delSongList:res.result.data
                  })
                })
              })
            wx.showToast({
                title: '删除成功',
                icon:'success',
                duration:2000
              })
        }else if(sm.cancel){
          console.log("取消了")
        }
        }
      })
  },

  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },

  onChangeII(e){//选择器事件
//    console.log(e)
    this.setData({
      type:Number(e.detail),//保存type
      radio:e.detail
    })
  },

  dialogOnClose(){
    this.setData({
      radio:'0'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    if(this.data.title==="删除歌曲")
    {
      console.log("刷新")
      this.getInfor(this.data.title)
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
