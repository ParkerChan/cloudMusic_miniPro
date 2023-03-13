// pages/statisticDet/statisticDet.js
import * as echarts from '../../ec-canvas/echarts'

let chart=null
let app=getApp()
let tmp=[]
/*var optionI = {
  title: {
      text: '用户播放音乐次数饼图',
      subtext: '微‘鑫’音乐播放器',
      left: 'center'
  },
  tooltip: {
      show:true,
      trigger: 'item',
      padding:[20,10,20,10],
      formatter: function(par)
      {
        console.log(par)
      }
  },
  legend: {
      orient: 'vertical',
      left: 'left',
  },
  series: [
      {
          name: '播放次数',
          type: 'pie',
          radius: '50%',
          minShowLabelAngle:0.001,
          data: [
          ],
          emphasis: {
              itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
          }
      }
  ]
} */
var optionI={
  title:{
    text: '所有用户',
    subtext: '总播放次数',
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec:{
      onInit:initChart
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
function initChart(canvas,width,height){
 /*   chart=echarts.init(canvas,null,{
      width:width,
      height:height
    })
    canvas.setChart(chart)//图表初始化
    //图标数据初始化
    let n=app.globalData.user_n
    let w=app.globalData.user_w
    let y=app.globalData.user_y
    let t0={},t1={},t2={}
    t0.value=n,t0.name="网易用户"+String(n)+"次",tmp.push(t0);
    t1.value=w,t1.name="微信用户"+String(w)+"次",tmp.push(t1);
    t2.value=y,t2.name="游客用户"+String(y)+"次",tmp.push(t2);
//    console.log(tmp)
    optionI.series[0].data=tmp
    chart.setOption(optionI)
    return chart */
    chart=echarts.init(canvas,null,{
      width:width,
      height:height
    })
    canvas.setChart(chart)//图表初始化
    //图标数据初始化
    let name=["游客用户","微信用户"]
    let date=[app.globalData.user_y,app.globalData.user_w]
    optionI.xAxis.data=name
    optionI.series[0].data=date
    chart.setOption(optionI)
    return chart  
}