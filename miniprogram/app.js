//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    
  },
  globalData:{
    //其他页面的播放器
    isPlaying:false,
    isPlay:true,
    index:-1,
    ids:[],
    picUrl:"",
    singer:"",
    mname:"",

    //管理员添加歌曲列表
    songList:[],

    //用户注销
    offTime:"",//用户注销时间
    noLogin:false,
    //统计模块数据，获取到三种用户的总播放次数
    user_w:-1,
    user_y:-1,
    //分别获取到三种用户播放量最高的三首歌曲
    hotlist_wbits:[3],
    hotlist_ybits:[3],
    hotlist_wname:[3],
    hotlist_yname:[3]
  },

  getCloudOpenid: async function () {
    return this.openid = this.openid || (await wx.cloud.callFunction({name: 'login'})).result.openid
  },
})
