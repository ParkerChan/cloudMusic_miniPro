import request from "../../utils/request"
const db=wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playList:[],//歌单数据详情
    title:"",//背景图区的文字显示
    userSongList:[],//用户歌单数据
    isShow:false,//添加歌单弹窗默认不显示
    songIndex:-1,//用于保存当前用户点击需要收藏的歌曲的下标
    userInfor:{}//网易用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      title:options.title
    })
    this.getInfor(options.playlistId);
    if(wx.getStorageSync('loginMode')==1)//网易用户登录则存下用户信息
    {
      let userInfor=wx.getStorageSync('userInfor');
      if(userInfor)
      {
        this.setData({
          userInfor:JSON.parse(userInfor)
        })
      }
    }
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
    let index=parseInt(Math.random()*this.data.playList.length);
    let idList=[];
    this.data.playList.map(item=>{
      idList.push(item.id);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
  },

  toPlay(e){
    let tmp=e.currentTarget.dataset.index;//拿到点击歌曲的下标值
    let idList=[];
    this.data.playList.map(item=>{
      idList.push(item.id);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${tmp}&idList=${idList}`,
    })
  },

  async getInfor(id){
    let res=await request('/playlist/detail',{id:id})
    console.log(res)
    let playList=[]
    for(let i=0;i<20;i++)//只拿10首(仍然是需要登录的，只有登录之后才能拿到更多数据)
    {
      playList.push(res.playlist.tracks[i])
    }
    this.setData({
      playList
    })
  },

  //显示用户歌单歌单
  more(e){
    if(wx.getStorageSync('isLogin'))//已经登录
    {
      if(wx.getStorageSync('loginMode')==1)//网易用户
      {
        let uid=this.data.userInfor.userId
        let index=e.currentTarget.dataset.index
        wx.cloud.callFunction({
          name:'getUserSongList',
          data:{
            uid:String(uid)
          }
        }).then(res=>{
          if(res.result.data.length==0)//当前用户没有任何歌单
          {
            wx.showToast({
              title: '抱歉，您暂时没有任何歌单',
              icon:'none'
            })
            return ;
          }else{
            this.setData({
              userSongList:res.result.data,
              isShow:true,
              index
            })
          }
        })
      }
      else if(wx.getStorageSync('loginMode')==2)//微信用户
      {
        let uid=wx.getStorageSync('openId')
        let index=e.currentTarget.dataset.index
        wx.cloud.callFunction({
          name:'getUserSongList',
          data:{
            uid:uid
          }
        }).then(res=>{
          if(res.result.data.length==0)//当前用户没有任何歌单
          {
            wx.showToast({
              title: '抱歉，您暂时没有任何歌单',
              icon:'none'
            })
            return ;
          }else{
            this.setData({
              userSongList:res.result.data,
              isShow:true,
              index
            })
          }
        })
      }
    }else{
      wx.showToast({
        title: '抱歉，先登录之后才能添加到歌单~',
        icon:'none'
      })
    }
  },

  //进行添加歌单功能
  async addMyList(e){
    let listIndex=e.currentTarget.dataset.index //拿到当前用户所选的歌单
    let listName=this.data.userSongList[listIndex].listName
    let coverImgUrl=this.data.playList[this.data.index].al.picUrl//更新个人歌单背景图
    let mId=this.data.playList[this.data.index].id
    console.log(listName)
    console.log(coverImgUrl)
    if(wx.getStorageSync('loginMode')==1)//网易用户还没写
    {
      let re=await request('/song/url',{id:this.data.playList[this.data.index].id});
      if(re.data[0].url==null)
      {
        wx.showToast({
          title: '抱歉，版权原因暂无歌曲',
          icon:'none'
        })
        this.setData({
          isShow:false
        })
        return ;
      }
      wx.cloud.callFunction({
        name:'isAddList',
        data:{
          uid:String(this.data.userInfor.userId),
          mId:String(mId),
          listName:String(listName)
        }
      }).then(res=>{
        console.log(res)
        if(res.result.data.length==0)//当前歌曲没被该用户添加到该歌单
        {
          wx.cloud.callFunction({
            name:'addToList',
            data:{
              mId:String(this.data.playList[this.data.index].id),
              listName:listName,
              uid:String(this.data.userInfor.userId)
            }
          }).then(res=>{
            console.log("用户歌单歌曲添加完成")
            wx.showLoading({
              title: '添加中。。。',
            })
            wx.cloud.callFunction({
              name:'upCoverImg',
              data:{
                uid:String(this.data.userInfor.userId),
                listName:listName,
                coverImgUrl:coverImgUrl
              }
            }).then(res=>{
              console.log("用户歌单背景图更新完成")
              wx.hideLoading()
              wx.showToast({
                title: '添加成功！',
                icon:'none'
              })
              this.setData({
                isShow:false
              })
            })
          })
        }else{
          wx.showToast({
            title: '歌曲已存在！',
            icon:'none'
          })
        }
      })
    }
    else if(wx.getStorageSync('loginMode')==2)
    {
      let re=await request('/song/url',{id:this.data.playList[this.data.index].id});
      if(re.data[0].url==null)
      {
        wx.showToast({
          title: '抱歉，版权原因暂无歌曲',
          icon:'none'
        })
        this.setData({
          isShow:false
        })
        return ;
      }
      //else 当前歌曲有url进行播放
      wx.cloud.callFunction({
        name:'isAddList',
        data:{
          uid:String(wx.getStorageSync('openId')),
          mId:String(mId),
          listName:String(listName)
        }
      }).then(res=>{
        console.log(res)
        if(res.result.data.length==0)//当前歌曲没被该用户添加到该歌单
        {
          wx.cloud.callFunction({
            name:'addToList',
            data:{
              mId:String(this.data.playList[this.data.index].id),
              listName:listName,
              uid:String(wx.getStorageSync('openId'))
            }
          }).then(res=>{
            console.log("用户歌单歌曲添加完成")
            wx.cloud.callFunction({
              name:'upCoverImg',
              data:{
                uid:String(wx.getStorageSync('openId')),
                listName:listName,
                coverImgUrl:coverImgUrl
              }
            }).then(res=>{
              console.log("用户歌单背景图更新完成")
              wx.showToast({
                title: '添加成功！',
                icon:'none'
              })
              this.setData({
                isShow:false
              })
            })
          })
        }else{
          wx.showToast({
            title: '歌曲已存在！',
            icon:'none'
          })
        }
      })
    }
  },

  async getUrl(mid)
  {
    let res=await request('/song/url',{id:mid});
    return res
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