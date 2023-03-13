// pages/personList/personList.js
const db=wx.cloud.database();
let timeI=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfor:{},
    songList:[],
    bgUrl:"",
    coverImgUrl:"",
    listName:"",
    playingId:"",
    isNone:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //  console.log(options)
    if(wx.getStorageSync('loginMode')==1)
    {
      this.setData({
        userInfor:JSON.parse(wx.getStorageSync('userInfor'))
      })
    }
    if(options.listName)
    {
      this.getInfor(options.listName)
      this.setData({
        listName:options.listName
      })
    }
    else{
      wx.showToast({
        title: '抱歉，出现了错误',
        icon:'none'
      })
      wx.navigateBack()
    }
  },

  getInfor(name)
  {
    if(wx.getStorageSync('loginMode')==1)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name:'getuserListDetail',
        data:{
          uid:String(this.data.userInfor.userId),
          listName:name
        }
      }).then(res=>{
        if(res.result.data.length==0)
        {
          wx.hideLoading()
          this.setData({
            isNone:true
          })
          wx.cloud.callFunction({
            name:'findUserSongList',
            data:{
              listName:name,
              uid:String(this.data.userInfor.userId)
            }
          }).then(res=>{
            this.setData({
              coverImgUrl:res.result.data[0].coverImgUrl
            })
          })
        }else{
          this.setData({
            songList:res.result.data
          })
          wx.hideLoading()
          wx.cloud.callFunction({
            name:'findUserSongList',
            data:{
              listName:name,
              uid:String(this.data.userInfor.userId)
            }
          }).then(res=>{
            this.setData({
              coverImgUrl:res.result.data[0].coverImgUrl
            })
          })
        }
      })
    }else if(wx.getStorageSync('loginMode')==2)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name:'getuserListDetail',
        data:{
          uid:String(wx.getStorageSync('openId')),
          listName:name
        }
      }).then(res=>{
        if(res.result.data.length==0)
        {
          wx.hideLoading()
          this.setData({
            isNone:true,
            songList:[]
          })
          wx.cloud.callFunction({
            name:'findUserSongList',
            data:{
              listName:name,
              uid:String(wx.getStorageSync('openId'))
            }
          }).then(res=>{
            this.setData({
              coverImgUrl:res.result.data[0].coverImgUrl
            })
          })
        }else{
          this.setData({
            songList:res.result.data
          })
          wx.hideLoading()
          wx.cloud.callFunction({
            name:'findUserSongList',
            data:{
              listName:name,
              uid:String(wx.getStorageSync('openId'))
            }
          }).then(res=>{
            this.setData({
              coverImgUrl:res.result.data[0].coverImgUrl
            })
          })
        }
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

  suiPlay(e){//全部随机播放
    let index=parseInt(Math.random()*this.data.songList.length);
    let id=String(this.data.songList[index].mId)
    this.setData({
      playingId:id
    })
    console.log(index)
    let idList=[];
    this.data.songList.map(item=>{
      idList.push(item.mId);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
  },

  toSongDetail(e){
    console.log(e)
    let index=e.currentTarget.dataset.index;
    let id=this.data.songList[index].mId
    this.setData({
      playingId:id
    })
    let idList=[]
    this.data.songList.map(item=>{
      idList.push(item.mId);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let id=wx.getStorageSync('playId')
    if(id)//如果id存在
    {
      this.setData({
        playingId:String(id)
      })
    }
    timeI=setInterval(()=>{
      this.setData({
        playingId:String(wx.getStorageSync('playId'))
      })
    },1000)
  },

  del(e){
    let index=e.currentTarget.dataset.index
    if(wx.getStorageSync('loginMode')==1)
    {
      let that=this
      wx.showModal
        ({//使用API实现确认框的功能
        title:"提示",
        content:"要取消收藏吗？",
        success(sm)
        {
          if(sm.confirm)
          {
          wx.cloud.callFunction({
            name:'delSongOfUserList',
            data:{
                  uid:String(that.data.userInfor.userId),
                  mId:String(that.data.songList[index].mId),
                  listName:String(that.data.listName)
                }
              }).then(res=>{
                console.log("删除成功")
              })
            wx.showToast({
                title: '取消成功',
                icon:'success',
                duration:2000
              })
        }else if(sm.cancel){
          console.log("取消了")
        }
        }
      })
    }else if(wx.getStorageSync('loginMode')==2)
    {
      let that=this
      wx.showModal
        ({//使用API实现确认框的功能
        title:"提示",
        content:"要取消收藏吗？",
        success(sm)
        {
          if(sm.confirm)
          {
          wx.cloud.callFunction({
            name:'delSongOfUserList',
            data:{
                  uid:String(wx.getStorageSync('openId')),
                  mId:String(that.data.songList[index].mId),
                  listName:String(that.data.listName)
                }
              }).then(res=>{
                console.log("删除成功")
                that.onPullDownRefresh()
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
    clearInterval(timeI);//销毁计时器
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */

  onRefresh(){
    this.getInfor(this.data.listName)
  },

  onPullDownRefresh: function () {
    this.onRefresh()
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