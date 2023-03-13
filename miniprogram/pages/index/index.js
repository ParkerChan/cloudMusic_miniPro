
import request from "../../utils/request"
import pusub from 'pubsub-js'
let phone=wx.getSystemInfoSync()
let app=getApp()
let time=''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],//轮播图
    hotRecommendsong:[],//精心推荐歌单
    newSong:[],//推荐新音乐
    userInfor:{},//登录的用户信息
    

    //简易播放器模块数据
    isPlay:true,
    isPlaying:false,
    singer:"",
    mname:"",
    picUrl:""

  },
//主页获取对应信息
 async getInfo(){
    //轮播图
    let result
    if(phone.system[0]==='i')
    {
      if(phone.model[3]==='d')
      {
  //      console.log("ipad")
        result=await request('/banner',{type:3});
        this.setData({
          banners:result.banners
        })
      }else{
  //      console.log("iphone")
        result=await request('/banner',{type:2});
        this.setData({
          banners:result.banners
        })
      } 
    }
    else if(phone.system[0]==='A')
    {
  //    console.log("ando")
      result=await request('/banner',{type:1});
      this.setData({
        banners:result.banners
      }) 
    }
    //热门歌单
    result=await request('/personalized?limit=10')
    this.setData({
      hotRecommendsong:result.result
    }) 
    //推荐新歌
    result=await request('/personalized/newsong');
//    console.log(result)
    this.setData({
      newSong:result.result
    })
  },

 async toRecommendSongList(e){
    console.log(e)
    let id=this.data.hotRecommendsong[e.currentTarget.dataset.index].id
    wx.navigateTo({
      url: `/pages/listDetail/listDetail?id=${id}`,//推荐歌单列表js中拿到当前点击的歌单ID
    })
  },

  smusicPlay(e){
  //  console.log(e)
  },

  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  toRecommendList(){
    wx.navigateTo({
      url: '/pages/recommendNew/recommendNew',
    })
  },

  toRankTab(){
    wx.navigateTo({
      url: '/pages/rankingTab/rankingTab',
    })
  },

  toHotList(){
    wx.navigateTo({
      url: '/pages/hotSongList/hotSongList',
    })
  },

  //去播放页面
  toSongDetail(e)
  {
    let index=e.currentTarget.dataset.index;
    let idList=[];
    this.data.newSong.map(item=>{
      idList.push(item.id);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let tmp2=0;
      wx.setStorageSync('playMode',tmp2);//播放模式初始化
    wx.setStorageSync('playId',-1)//重新编译后将当前正在播放的id重置
//    console.log(wx.getStorageSync('playMode'))
//    console.log(phone)
    this.getInfo();
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
    let userInfor=wx.getStorageSync('userInfor');
    if(userInfor)
    {
      this.setData({
        userInfor:JSON.parse(userInfor)
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
    //  console.log(wx.getStorageInfoSync())
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
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