// pages/statisticDet/statisticDet.js
import * as echarts from '../../ec-canvas/echarts'

let chart=null
let app=getApp()
/*let optionI = {
  title:{
    text: '网易用户',
    subtext: '最热门三首歌曲',
  },
  xAxis: {
      type: 'category',
      data: [],
      axisLabel:{
        margin:8,
        formatter:function(params){
          var val="";
          if(params.length>8)
          {
            val=params.substr(0,8)+'...';
            return val;
          }else{
            return params;
          }
        }
      }
  },
  yAxis: {
      type: 'value'
  },
  series: [{
      data: [],
      type: 'bar'
  }]
} */
let optionII = {
  title:{
    text: '微信用户',
    subtext: '最热门三首歌曲',
  },
  xAxis: {
      type: 'category',
      data: [],
      axisLabel:{
        margin:8,
        formatter:function(params){
          var val="";
          if(params.length>8)
          {
            val=params.substr(0,8)+'...';
            return val;
          }else{
            return params;
          }
        }
      }
  },
  yAxis: {
      type: 'value'
  },
  series: [{
      data: [],
      type: 'bar'
  }]
}
let optionIII = {
  title:{
    text: '游客用户',
    subtext: '最热门三首歌曲',
  },
  xAxis: {
      type: 'category',
      data: [],
      axisLabel:{
        margin:8,
        formatter:function(params){
          var val="";
          if(params.length>8)
          {
            val=params.substr(0,8)+'...';
            return val;
          }else{
            return params;
          }
        }
      }
  },
  yAxis: {
      type: 'value'
  },
  series: [{
      data: [],
      type: 'bar'
  }]
}
/*function initChartI(canvas,width,height){//网易用户数据
  chart=echarts.init(canvas,null,{
    width:width,
    height:height
  })
  canvas.setChart(chart)//图表初始化
  //图标数据初始化
  optionI.xAxis.data=app.globalData.hotlist_nname
  optionI.series[0].data=app.globalData.hotlist_nbits
  chart.setOption(optionI)
  return chart
} */
function initChartII(canvas,width,height){//微信用户数据
  chart=echarts.init(canvas,null,{
    width:width,
    height:height
  })
  canvas.setChart(chart)//图表初始化
  //图标数据初始化
  optionII.xAxis.data=app.globalData.hotlist_wname
  optionII.series[0].data=app.globalData.hotlist_wbits
  chart.setOption(optionII)
  return chart
}
function initChartIII(canvas,width,height){//游客用户数据
  chart=echarts.init(canvas,null,{
    width:width,
    height:height
  })
  canvas.setChart(chart)//图表初始化
  //图标数据初始化
  optionIII.xAxis.data=app.globalData.hotlist_yname
  optionIII.series[0].data=app.globalData.hotlist_ybits
  chart.setOption(optionIII)
  return chart
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
  /*  ecI:{
      onInit:initChartI
    }, */
    ecII:{
      onInit:initChartII
    },
    ecIII:{
      onInit:initChartIII
    }
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