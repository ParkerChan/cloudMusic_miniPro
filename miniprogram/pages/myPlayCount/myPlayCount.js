// miniprogram/pages/myLike/myLike.js
const db=wx.cloud.database();
let timeI=''//定时器
let time=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playCountList:{},
    userInfor:{},
    isCountNull:false,
    bgUrl:"", //换成你自己的背景图和模糊图地址即可
    coverImgUrl:"",
    playingId:-1,
    floorstatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfor()
  },
  
  allSuiPlay(e){//全部随机播放
    let index=parseInt(Math.random()*this.data.playCountList.length);
    console.log(index)
    let id=String(this.data.playCountList[index].mId)
    this.setData({
      playingId:id
    })
    let idList=[];
    this.data.playCountList.map(item=>{
      idList.push(item.mId);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
  },

  suiPlay(){
    let index=parseInt(Math.random()*this.data.playCountList.length);
    let id=String(this.data.playCountList[index].mId)
    this.setData({
      playingId:id
    })
    console.log(index)
    let idList=[];
    this.data.playCountList.map(item=>{
      idList.push(item.mId);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
  },

  toSongDetail(e){
    console.log(e)
    let index=e.currentTarget.dataset.index;
    let idList=[]
    let id=this.data.playCountList[index].mId
    this.setData({
      playingId:id
    })
    this.data.playCountList.map(item=>{
      idList.push(item.mId);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
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

  getInfor(){
    if(wx.getStorageSync('loginMode')==1)//网易用户
    {
      this.setData({
        userInfor:JSON.parse(wx.getStorageSync('userInfor'))
      })
      let id=this.data.userInfor.userId;
      wx.cloud.callFunction({
        name:'getAllRencentList',
        data:{
          uid:String(id)
        }
      }).then(res=>{
        console.log(res)
        if(res.result.data.length!=0)//有数据
        {
          this.setData({
            playCountList:res.result.data,
            isCountNull:false
          })
        }else{
          this.setData({
            isCountNull:true
          })
          wx.showToast({
            title: '暂无播放记录',
            icon:'none'
          })
          wx.navigateBack()
        }
      })
    }else if(wx.getStorageSync('loginMode')==2)
    {
      let uid=String(wx.getStorageSync('openId'));
      wx.cloud.callFunction({
        name:'getAllRencentList',
        data:{
          uid:uid
        }
      }).then(res=>{
        if(res.result.data.length!=0)//有数据
        {
          this.setData({
            playCountList:res.result.data,
            isCountNull:false
          })
        }else{
          this.setData({
            isCountNull:true
          })
      /*    wx.showToast({
            title: '暂无播放记录',
            icon:'none'
          })
          wx.navigateBack() */
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
    time=setInterval(()=>{
      this.getInfor()
    },3000)
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