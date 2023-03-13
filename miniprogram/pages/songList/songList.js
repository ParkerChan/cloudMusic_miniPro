// miniprogram/pages/recommend/recommend.js
import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    SongList:{} //每日推荐
  },

 async getInfo(){
    let tmp=await request('/personalized/newsong');
    console.log(tmp)
    this.setData({
      SongList:tmp.result
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
  },

    //返回顶部功能代码
    scrolltoupper:function(e){
      console.log(e)
      if (e.detail.scrollTop > 1) {
        this.setData({
          cangotop: true
        });
      } else {
        this.setData({
          cangotop: false
        });
      }
    },
    goTop: function (e) {  // 一键回到顶部
      this.setData({
        topNum:0
      });
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