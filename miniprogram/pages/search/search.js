import request from "../../utils/request"
//let isSend=false //函数节流
let time=''
let timeII=-1//防抖
let historyList=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWords:"",
    hotSearchList:[],
    searchContent:"",//用户输入内容
    searchList:[],//关键字拿到的数据
    historyList:[],//点击搜索按钮之后再放进去
    listShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    this.getInfor()
  },

  async getInfor(){
    let keyWords=await request('/search/default')
    let hotSearchList=await request('/search/hot/detail')
    this.setData({
      keyWords:keyWords.data.showKeyword,
      hotSearchList:hotSearchList.data
    })
    wx.hideLoading()
  },

  search(){
  /*  //搜索历史记录，要把记录存到云数据库里面
    let index=historyList.indexOf(this.data.searchContent)
    if(index!==-1)//关键字有当前关键字记录
    {
      historyList.splice(historyList.indexOf(this.data.searchContent),1)
    }
    historyList.unshift(this.data.searchContent)
    this.setData({
      historyList
    }) */
    if(this.data.searchContent.length===0)//搜索内容为空
    {
      wx.navigateTo({
        url: `/pages/searchDetail/searchDetail?keyword=${this.data.keyWords}`,
      })
    }
    else{
      wx.navigateTo({
        url: `/pages/searchDetail/searchDetail?keyword=${this.data.searchContent}`,
      })
    }
  },

  searchList(e){
    console.log(e)
    let index=e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/searchDetail/searchDetail?keyword=${this.data.searchList[index].name}`,
    })
  },

  searchHot(e){
    console.log(e)
    let index=e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/searchDetail/searchDetail?keyword=${this.data.hotSearchList[index].searchWord}`,
    })
  },

  //表单内容发生改变事件
  handleInputChange(e){
    //更新searchContent内容
    console.log("输入事件")
    this.setData({
      searchContent:e.detail.value
    })

    clearTimeout(timeII)
    timeII=setTimeout(()=>{
      this.getSearchList()
    },1500)
    
   /* if(isSend)
    {
      return ;
    }
    isSend=true;
    this.getSearchList()
    //节流、防抖
    setTimeout(()=>{
      //获取内容
      isSend=false
    },100) */
  },

  async getSearchList(){
    console.log("搜索列表")
    if(this.data.searchContent.length===0)
    {
      this.setData({
        searchList:[],
        listShow:false
      })
      return 
    }else{
        let searchList=await request('/search',{keywords:this.data.searchContent,limit:10})
      this.setData({
        searchList:searchList.result.songs,
        listShow:true
      })
    }
    
/*    console.log(searchList)
    this.setData({
      searchList:searchList.result.songs
    }) */
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
    time=setInterval(()=>{
      if(this.data.searchContent.length===0)
      {
        this.setData({
          listShow:false,
          searchList:[]
        })
      }
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