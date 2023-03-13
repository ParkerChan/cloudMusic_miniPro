// miniprogram/pages/myLike/myLike.js
const db=wx.cloud.database();
let timeI=''//定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SongList:[],
    userInfor:{},
    bgUrl:"", //改成你自己的背景图和模糊图地址就行
    coverImgUrl:"",
    playingId:"",
    showCreatList:false,
    topNum: 0,
    isNull:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfor()
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
    let index=parseInt(Math.random()*this.data.SongList.length);
    let id=String(this.data.SongList[index].mId)
    this.setData({
      playingId:id
    })
    console.log(index)
    let idList=[];
    this.data.SongList.map(item=>{
      idList.push(item.mId);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
  },

  toSongDetail(e){
    console.log(e)
    let index=e.currentTarget.dataset.index;
    let id=this.data.SongList[index].mId
    this.setData({
      playingId:id
    })
    let idList=[]
    this.data.SongList.map(item=>{
      idList.push(item.mId);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
  },

  getInfor(){
    if(wx.getStorageSync('loginMode')==1)//网易用户
    {
      this.setData({
        userInfor:JSON.parse(wx.getStorageSync('userInfor'))
      })
      let id=this.data.userInfor.userId;
      wx.cloud.callFunction({
        name:'getAllLikeSong',
        data:{
          uid:String(id)
        }
      }).then(res=>{
        if(res.result.data.length!=0)//有数据
        {
          this.setData({
            SongList:res.result.data
          })
        }else{
          wx.showToast({
            title: '暂无歌曲，快去收藏歌曲吧',
            icon:'none'
          })
          wx.navigateBack()
        }
      })
    }else if(wx.getStorageSync('loginMode')==2)
    {
      let uid=String(wx.getStorageSync('openId'))
      wx.cloud.callFunction({
        name:'getAllLikeSong',
        data:{
          uid:uid
        }
      }).then(res=>{
        console.log(res)
        if(res.result.length!=0)//有数据
        {
          this.setData({
            SongList:res.result,
            isNull:false
          })
        }else
        {
        /*  wx.showToast({
            title: '暂无歌曲，快去收藏歌曲吧',
          })
          wx.navigateBack() */
          this.setData({
            isNull:true,
            SongList:[]
          })
        }
      })
    }
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
            name:'delLikeSong',
            data:{
                  uid:String(that.data.userInfor.userId),
                  mId:String(that.data.SongList[index].mId)
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
            name:'delLikeSong',
            data:{
                  uid:String(wx.getStorageSync('openId')),
                  mId:String(that.data.SongList[index].mId)
                }
              }).then(res=>{
                console.log("删除成功")
                that.onPullDownRefresh()
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
    }
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
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onRefresh();
  },
  onRefresh(){
    this.getInfor()
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