import request from "../../utils/request"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankListNet:[],//官方榜数据
    rankListStyle:[]//曲风榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfor()
  },

  //获取到排行榜数据
  async getInfor(){
    wx.showLoading({
      title: '加载中',
    })
    let res=await request('/toplist/detail');
    console.log(res)
    let rankListNet=[]
    let rankListStyle=[]
    for(let i=0;i<4;i++) //只拿到四个榜单信息
    {
      rankListNet.push(res.list[i])
    }
    for(let j=24;j<=27;j++)
    {
      rankListStyle.push(res.list[j])
    }
    this.setData({
      rankListNet,
      rankListStyle
    })
    wx.hideLoading()
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