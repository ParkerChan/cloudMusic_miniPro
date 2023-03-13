import request from "../../utils/request"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    songList:{},//获取当前歌单的歌曲内容
    bgUrl:"",//前端页面的背景图
    name:""//歌单名称
  },

  //获取详情歌曲信息
  async getInfor(id){
    let res=await request('/playlist/detail',{id:id});
    console.log(res)
    this.setData({
      songList:res.playlist.tracks,
      bgUrl:res.playlist.coverImgUrl,
      name:res.playlist.name
    }) 
  },

      //返回顶部功能代码
  scrolltoupper:function(e){
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.songListId)
    let id=options.songListId
    this.getInfor(id)
  },

  toPlay(e){
    let tmp=e.currentTarget.dataset.index;//拿到点击歌曲的下标值
    let idList=[];
    this.data.songList.map(item=>{
      idList.push(item.id);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${tmp}&idList=${idList}`,
    })
  },

  //随机播放
  allSuiPlay(e){
    let index=parseInt(Math.random()*this.data.songList.length);
    let idList=[];
    this.data.songList.map(item=>{
      idList.push(item.id);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
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