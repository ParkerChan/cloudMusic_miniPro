// pages/hotSongList/hotSongList.js
import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:2,
    title:"",
    songList:[]//歌单列表
  },

  onClick(event) {
    console.log(event)
    this.setData({//拿到当前选中的下标和标题
      active:event.detail.index,
      title:event.detail.title
    })
    this.getInfor(this.data.title)
  },

  async getInfor(title){
    wx.showLoading({
      title: '加载中',
    })
    let res
    if(title==="古风")
    {
      res=await request('/top/playlist/highquality',{cat:title,limit:6})
    }else if(title==="粤语")
    {
      res=await request('/top/playlist/highquality',{cat:title,limit:9})
    }
    else if(title==="流行")
    {
      res=await request('/top/playlist/highquality',{cat:title,limit:9})
    }else{
      res=await request('/top/playlist/highquality',{cat:title,limit:15})
    }
    this.setData({
      songList:res.playlists
    })
    wx.hideLoading()
  },

  toListDetil(e){
    console.log(e)
    let id=e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/listDetail/listDetail?id=${this.data.songList[id].id}`,
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