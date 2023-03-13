import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    songList:[],
    title:""
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      title:options.title
    })
    this.getInfor(options.id)
  },

  async getInfor(id){
    let res=await request("/playlist/detail",{id:id})
    console.log(res)
    let songList=[]
    if(res.playlist.tracks.length>10&&res.playlist.tracks.length<20)
    {
      for(let i=0;i<res.playlist.tracks.length;i++)
      {
        songList.push(res.playlist.tracks[i])
      }
    }else if(res.playlist.tracks.length<=10)
    {
      for(let i=0;i<res.playlist.tracks.length;i++)
      {
        songList.push(res.playlist.tracks[i])
      }
    }else{
      for(let i=0;i<20;i++)
      {
        songList.push(res.playlist.tracks[i])
      }
    }
    this.setData({
      songList
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