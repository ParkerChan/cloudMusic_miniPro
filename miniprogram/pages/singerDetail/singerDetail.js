// miniprogram/pages/singerDetail/singerDetail.js
var dayjs=require('../../miniprogram_npm/dayjs/index')
import request from "../../utils/request"
let timeI=''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    singerName:"",
    picUrl:"",
    userInfor:{},
    id:"",
    playingId:-1,
    bgUrl:"",
    songList:[],
    userSongList:[],
    topNum: 0,
    songIndex:-1,
    index:-1,
    isShow:false
  },

    // 获取滚动条当前位置
    onPageScroll: function (e) {
      if (e.scrollTop > 100) {
        this.setData({
          floorstatus: true
        });
      } else {
        this.setData({
          floorstatus: false
        });
      }
  },
  
    //回到顶部
    goTop: function (e) {  // 一键回到顶部
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
  },

  //显示用户自建歌单
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
              index //存下需要添加至歌单的歌曲下标
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
    let coverImgUrl=this.data.songList[this.data.index].al.picUrl//更新个人歌单背景图
    let mId=this.data.songList[this.data.index].id
    let time=new Date()
    let addTime=dayjs(time).format("YYYY-MM-DD HH:mm:ss")
    console.log(listName)
    console.log(coverImgUrl)
    if(wx.getStorageSync('loginMode')==1)//网易用户
    {
      let re=await request('/song/url',{id:this.data.songList[this.data.index].id});
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
              mId:String(this.data.songList[this.data.index].id),
              listName:listName,
              uid:String(this.data.userInfor.userId),
              mname:String(this.data.songList[this.data.index].name),
              singer:String(this.data.songList[this.data.index].ar[0].name),
              addTime:addTime
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
      let re=await request('/song/url',{id:this.data.songList[this.data.index].id});
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
      //else 当前歌曲有url则进行播放
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
              mId:String(this.data.songList[this.data.index].id),
              listName:listName,
              uid:String(wx.getStorageSync('openId')),
              mname:String(this.data.songList[this.data.index].name),
              singer:String(this.data.songList[this.data.index].ar[0].name),
              addTime:addTime
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

  onSelect(e){
    console.log(e)
    this.setData({
      playingId:e.currentTarget.dataset.musicid
    })
    let index=e.currentTarget.dataset.index;
    let idList=[];
//    wx.setStorageSync('playId',e.currentTarget.dataset.musicid);//number类型
    this.data.songList.map(item=>{
      idList.push(item.id);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
  },

  suiPlay(){
    let index=parseInt(Math.random()*this.data.songList.length);
    this.setData({
      playingId:this.data.songList[index].id
    })
    let idList=[];
    this.data.songList.map(item=>{
      idList.push(item.id);
    });
    wx.navigateTo({
      url: `/pages/songPlay/songPlay?index=${index}&idList=${idList}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //  console.log(options)
    this.setData({
      id:options.id
    })
    this.getInfor(options.id)
    if(wx.getStorageSync('loginMode')==1)
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

  async getInfor(id)
  {
    let res=await request('/artist/detail',{id:Number(id)})
    this.setData({
      singerName:res.data.artist.name,
      picUrl:res.data.artist.cover
    })
    let re=await request('/artist/top/song',{id:Number(id)})
    console.log(re)
    this.setData({
      songList:re.songs
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
    let id=wx.getStorageSync('playId')
    if(id)//如果id存在
    {
      this.setData({
        playingId:Number(id)
      })
    }
    timeI=setInterval(()=>{
      this.setData({
        playingId:wx.getStorageSync('playId')
      })
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
    clearInterval(timeI);//销毁计时器
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