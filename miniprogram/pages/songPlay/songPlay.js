// miniprogram/pages/songPlay/songPlay.js
var dayjs=require('../../miniprogram_npm/dayjs/index')
import request from "../../utils/request"
import pusub from 'pubsub-js'
import moment, { now } from 'moment'


let bg=wx.getBackgroundAudioManager();//背景音频
let timeId='';//定时器，定时更新播放页面
let app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //把当前歌曲添加到云数据库中
    userInfor:{}, //登录的用户信息
    idLists:[],

    //播放使用的变量
    playMode:0,//一共三种，分别是0,1,2；0表顺序播放，1表单曲循环，2表随机播放
    index:-1,//播放歌曲列表的下标
    isPlay:true,//默认为正在播放
    isSame:false,//重新点击音乐时两首音乐的播放地址是否一样
    isSlider:false,//进度条拖动状态，默认为不拖动
    value:0,//进度条的当前值
    min:0,//进度条初试值
    max:100,//进度条最大值
    nowTime:"00:00",//音乐当前播放的时间
    totalTime:"00:00",//音乐总的播放时间
    nowPlayUrl:"",//当前正在播放的歌曲地址
    isLike:false,//是否收藏？默认否
    isDemo:false,//是否为试听音乐
  //  isType:false,//用户stop函数中，对单曲循环模式下切歌的控制
  //  isUrlNull:false,//用户stop函数中，对没有播放地址歌曲的控制
    mname:"",
  //  tap:false,
    end:false,

    //isNext与isPre的作用是在一部分没有版权的音乐播放时，如果用户点击下一首播放的是无版权音乐，则自动切换下一首，反之如果点击的上一首，则自动切换上一首
    isNext:true,//默认下一首开启
    isPre:false,


    lrc:[],//歌词
    lrcTime:0,//歌词对应时间
    nowLrc:"",//当前播放时间下的歌词
    isLrc:true,//默认有歌词
    lrcLoding:true,//歌词加载字段
    lrcIsNull:false,

    idList:[], //存放播放列表的id字段
    songDet:{},//当前播放歌曲的详情信息
    urlDet:{},//当前播放歌曲的播放地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
//    console.log("播放页面的onload函数")
//    console.log(wx.getStorageSync('playMode'))
//    console.log(wx.getStorageSync('playId'))
    pusub.clearAllSubscriptions()//每次进来的时候，先把所有的订阅清空，然后再进行订阅，这里是避免跳转页面之后，订阅栈中的订阅量累计导致切歌bug
//    console.log(options.index,options.idList);
    app.globalData.ids=options.idList
    this.setData({
      idLists:options.idList
    })
    let idList=options.idList.split(',');//字符串拆分
    this.setData({
      index:Number(options.index),
      idList:idList
    })
    this.getSongDe();
    //此处进行背景音乐的播放状态动作初始化,无论用户是否停留在播放页面，只要背景音乐有动作，即进行如下功能
    bg.onEnded(()=>{
//      console.log("播放完毕。");
        if(wx.getStorageSync('playMode')===1)
        {
          this.nextII()
        }else{
          this.next();
        } 
     //   this.next()
    });
    bg.onPause(()=>{
      console.log("暂停播放");
      this.setData({
        isPlay:false
      });
      app.globalData.isPlay=this.data.isPlay
    });
    bg.onPlay(()=>{
      console.log("开始播放");
      this.setData({
        isPlay:true
      });
      app.globalData.isPlay=this.data.isPlay
    });
    bg.onTimeUpdate(()=>{
    //  console.log("播放进度更新！")
    });
    bg.onStop(()=>{
      console.log("音乐停止了")
    /*  if(!this.data.isUrlNull)//通过手机端点击×号停止音乐
      {
        console.log("当前歌曲无播放地址，停止歌曲播放")
        this.setData({
          isPlay:false,
          nowTime:"00:00",
          totalTime:"00:00",
          nowLrc:"",
          isType:false,
          isUrlNull:false
        })
        app.globalData.isPlaying=false
        app.globalData.index=-1
        app.globalData.ids=[]
        app.globalData.picUrl=""
        app.globalData.singer=""
        app.globalData.mname=""
        wx.setStorageSync('playId',-1)
        wx.setStorageSync('playSongUrl',"")
        let pages=getCurrentPages()//获取页面栈信息，以便实现跳转
        let res=pages.pop()
        if(res.route==="pages/songPlay/songPlay")
        {
          wx.navigateBack()
        } 
      //  wx.navigateBack()
      }
      if(this.data.isType===true)
      {
        this.setData({
          isType:false
        })
  //      console.log("修改后的istype",this.data.isType)
      }
      if(this.data.isUrlNull===true)
      {
        this.setData({
          isUrlNull:false
        })
   //     console.log("修改后的isUrlNull",this.data.isTUrlNull)
      } */
      this.setData({
        isPlay:false,
        nowTime:"00:00",
        totalTime:"00:00",
        nowLrc:""
      //  isType:false,
      //  isUrlNull:false
      })
      app.globalData.isPlaying=false
      app.globalData.index=-1
      app.globalData.ids=[]
      app.globalData.picUrl=""
      app.globalData.singer=""
      app.globalData.mname=""
      wx.setStorageSync('playId',-1)
      wx.setStorageSync('playSongUrl',"")
      let pages=getCurrentPages()//获取页面栈信息，以便实现跳转
        let res=pages.pop()
        if(res.route==="pages/songPlay/songPlay")
        {
          wx.navigateBack()
        } 
    })
    bg.onError((err)=>{
      // console.log("出错了")
      // console.log(err)
    })
    bg.onWaiting((res)=>{
      // console.log("等待中。。。")
      // console.log(res)
    })
    bg.onCanplay((res)=>{
      // console.log("可播放，但不保证后续能正常播放")
      // console.log(res)
    })
    //订阅外面页面的消息
    console.log(pusub)
    pusub.subscribe('message',(msg,data)=>{
      console.log("来自播放页的消息接受")
      if(data==="next")
      {
        this.next()
      }else if(data==="play")
      {
        this.toPlay()
      }else if(data==="pre")
      {
        this.last()
      }
//      pusub.unsubscribe('message')
    })//切歌的消息订阅
    console.log(pusub)
  },

  //点击歌手名称查看歌手信息
  toSingerDetail(){
    wx.redirectTo({
      url: `/pages/singerDetail/singerDetail?id=${this.data.songDet.ar[0].id}`,
    })

  },

  //进度条逻辑：
  sliderNow(e){//正在拖动时
    let value=Number(e.detail.value);
    let nowTime=moment(e.detail.value*1000).format('mm:ss')
//    console.log(nowTime)
//    console.log(value)
    this.setData({
      nowTime:nowTime,
      isSlider:true
    })
  },

  //当遇到播放id相同时：
  continuePlay(){
 //   console.log("地址相同，继续播放")
    this.setData({
      isPlay:true
    })
    bg.play();//继续播放
  },

  slider(e){//拖动完成时
//    console.log(e)
    let value=Number(e.detail.value);
    let nowTime=moment(e.detail.value*1000).format('mm:ss')
    this.setData({//完成拖动后修改当前值，并修改拖动标志
      value:value,
      nowTime:nowTime,  
      isSlider:false
    });
    bg.seek(value);
  },

  //获取当前歌曲的详情信息
  async getSongDe(){ 
    console.log("获取歌曲基本信息")
    let pages=getCurrentPages()//获取页面栈信息，以便实现跳转
        let res=pages.pop()
        if(res.route==="pages/songPlay/songPlay")
        {
          wx.showLoading({
            title: '加载中..',
          })
        }
    //判断当前播放音乐是否被用户收藏
    if(wx.getStorageSync('isLogin'))//当前如果有用户登录
    {
      if(wx.getStorageSync('loginMode')==1)//网易用户模式
      {
        let id=this.data.idList[this.data.index];//拿到当前下标的歌曲信息
        wx.cloud.callFunction({
          name:'findLikeSong',
          data:{
            mId:id,
            uid:String(this.data.userInfor.userId),
          }
        }).then(res=>{
          if(res.result.data.length==0)
          {
            this.setData({
              isLike:false
            })
          }else{
            this.setData({
              isLike:true
            })
          }
        })
      }else if(wx.getStorageSync('loginMode')==2)
      {
        let id=this.data.idList[this.data.index];//拿到当前下标的歌曲信息
        wx.cloud.callFunction({
          name:'findLikeSong',
          data:{
            mId:id,
            uid:String(wx.getStorageSync('openId')),
          }
        }).then(res=>{
          if(res.result.data.length==0)
          {
            this.setData({
              isLike:false
            })
          }else{
            this.setData({
              isLike:true
            })
          }
        })
      }
    }

    //判断是否已经有音乐正在播放，有则判断两首歌是否一致
//    let urltmp=wx.getStorageSync('playSongUrl');//获取到当前正在播放音乐的地址 
    let playId=wx.getStorageSync('playId')
//    console.log(playId)

    let id=this.data.idList[this.data.index];//拿到当前下标的歌曲信息
//    console.log(id)
    let songDet=await request('/song/detail',{ids:id})
    app.globalData.isPlaying=this.data.isPlay
    app.globalData.index=this.data.index
    app.globalData.singer=songDet.songs[0].ar[0].name
    app.globalData.mname=songDet.songs[0].name
    app.globalData.picUrl=songDet.songs[0].al.picUrl
//    console.log(songDet)
    this.setData({
      songDet:songDet.songs[0] //获取到歌曲信息，如专辑封面等
    })
    let urlDet=await request('/song/url',{id:id})
    if(urlDet.data[0].url==null)//需要播放的音乐是否有播放地址
    {
    /*  this.setData({
        isUrlNull:true
      }) */
    //  bg.stop()//暂停当前正在播放音乐
      wx.showToast({
        title: '抱歉，版权原因暂不能播放',
        icon:"none"
      },3000)
      if(this.data.isNext)
      {
        this.next()
      }
      if(this.data.isPre){
        this.last()
      }
      return;
    }
    this.setData({
      urlDet:urlDet.data[0] //获取到歌曲播放地址
    })

    if(playId==-1)//如果当前没有正在播放的音乐
    { 
      console.log("当前没有正在播放的音乐")
      wx.setStorageSync('playId',Number(id));
      this.setData({
        isSame:false//与当前播放音乐地址不同
      })
    //  this.playMusic();
    }else{//如果当前正有音乐播放
      console.log("当前有音乐正在播放")
      let tmpId=Number(id)
  //    console.log(typeof(id))
  //    console.log(typeof(playId))
      if(tmpId===playId)//与当前播放地址相同
      {
        console.log("两首歌曲ID相同")
        this.setData({
          isSame:true
        })
//        console.log("继续播放")
      }else{
        console.log("两首歌曲ID不相同,重新播放")
        wx.setStorageSync('playId',Number(id))
        this.setData({
          isSame:false
        })
      }
    }
  /*  if(!urltmp)//如果当前没有正在播放的音乐
    {
      console.log("当前没有正在播放的音乐")
      wx.setStorageSync('playSongUrl',this.data.urlDet.url);
      this.setData({
        isSame:false//与当前播放音乐地址不同
      })
      this.playMusic();
    }else{//如果当前正有音乐播放
      console.log("当前有音乐正在播放")
      let tmpurl=this.data.urlDet.url
      if(urltmp===tmpurl)//与当前播放地址相同
      {
        console.log("两首歌曲地址相同")
        this.setData({
          isSame:true
        })
//        console.log("继续播放")
      }else{
        console.log("两首歌曲地址不相同,重新播放")
        wx.setStorageSync('playSongUrl',this.data.urlDet.url)
        this.setData({
          isSame:false
        })
      }
    } */

    if(wx.getStorageSync('playMode')===1)//在单曲循环模式下的一些处理
    {
     /* if(this.data.isSame && this.data.tap===false)
      {
        console.log("单曲模式下，点击歌曲与当前歌曲id一致")
        this.continuePlay()
        if(res.route==="pages/songPlay/songPlay")
          {
            wx.hideLoading()
          }
          console.log("歌曲信息获取完毕")
      }else if(!this.data.isSame)//点击新音乐不同的时候
      {
        console.log("单曲模式下，点击歌曲与当前歌曲不一致")
        this.playMusic()
        if(res.route==="pages/songPlay/songPlay")
          {
            wx.hideLoading()
          }
          console.log("歌曲信息获取完毕")
      }else if(this.data.isSame && this.data.tap===true)
      {
        console.log("单曲模式下，点击切歌按钮")
        this.setData({
          tap:false
        })
        this.playMusic()
        if(res.route==="pages/songPlay/songPlay")
          {
            wx.hideLoading()
          }
          console.log("歌曲信息获取完毕")
      } */
      if(this.data.end)//单曲循环模式下，歌曲播放完毕了
      { 
        console.log("单曲模式下，当前歌曲播放完毕，重新播放")
        this.playMusic()
        if(res.route==="pages/songPlay/songPlay")
        {
          wx.hideLoading()
        }
        this.setData({
          end:false
        })
        console.log("歌曲信息获取完毕")
      }else if(this.data.isSame && this.data.end===false)//点击了同一首歌曲
      {
        console.log("单曲模式下，重新点击了同一首歌曲，继续播放")
        this.continuePlay()
        if(res.route==="pages/songPlay/songPlay")
        {
          wx.hideLoading()
        }
        console.log("歌曲信息获取完毕")
      }else if(!this.data.isSame)//重新点击了一首新的音乐或者进行了切歌动作
      {
        console.log("单曲模式下，重新点击了新的音乐或者进行了切歌动作，重新播放")
        this.playMusic()
        if(res.route==="pages/songPlay/songPlay")
        {
          wx.hideLoading()
        }
        console.log("歌曲信息获取完毕")
      }
    }else if(this.data.isSame && wx.getStorageSync('playMode')!==1)//根据isSame字段进行判断是否一致，并做对应动作，即如果两首歌歌曲相同且当前模式不为单曲循环模式
    {
      console.log("两首歌id相同且不为单曲循环模式")
        this.continuePlay()
        if(res.route==="pages/songPlay/songPlay")
        {
          wx.hideLoading()
        }
        console.log("歌曲信息获取完毕")
    }else{
      console.log("两首歌曲id不同且不为单曲模式")
      this.playMusic()
      if(res.route==="pages/songPlay/songPlay")
        {
          wx.hideLoading()
        }
        console.log("歌曲信息获取完毕")
    }

    //获取当前需要播放音乐的所有信息(歌词、播放地址等)
//    let url = await request('/song/url',{id:id}) //获取歌曲播放地址
    let song= await request('/song/detail',{ids:id}) //获取歌曲信息
    let lrc=await request('/lyric',{id:id}) //获取歌曲歌词
//    console.log(url)
 //   console.log(song)
    console.log(lrc)
 /*   wx.setNavigationBarTitle({
      title: song.songs[0].name
    }) */
    this.setData({
      mname:song.songs[0].name
    })
    
    //更新用户的播放记录：
    if(wx.getStorageSync('isLogin'))//当前有用户登录
    {
      let loginMode=wx.getStorageSync('loginMode')
      if(loginMode==1)//当前用户是以网易身份登录的
      {
        wx.cloud.callFunction({
          name:'findRecentSong_I',
          data:{
            mId:id, //检索云数据库中播放记录是否有该条歌曲记录
            uid:String(this.data.userInfor.userId)
          }
        }).then(res=>{
    //      console.log(res)
          if(res.result.data.length==0)//在线歌曲加个歌曲id的字段，通过歌曲id字段检数据库中网络歌曲
          {
            wx.cloud.callFunction({
              name:'addRcentSongList_I',
              data:{
                bits:1,
                mpic:song.songs[0].al.picUrl,
                singer:song.songs[0].ar[0].name,
                uid:String(this.data.userInfor.userId),
                mname:song.songs[0].name,
                mId:id
              }
            }).then(res=>{
    //          console.log(res)
    //          console.log("添加成功")
            })
          }
          else
          {
           wx.cloud.callFunction({
             name:'upRsongList_I',
             data:{
               mId:id,
               uid:String(this.data.userInfor.userId)
             }
           }).then(res=>{
    //         console.log("更新成功")
           })
          }
         })
         //更新全局播放记录(用户模式)
         wx.cloud.callFunction({
           name:'findPlayCount_U',
           data:{
             mId:id,
             userName:"网易用户",
           }
         }).then(res=>{
           if(res.result.data.length==0)
           {
             wx.cloud.callFunction({
               name:'addPlayCount_U',
               data:{
                 bits:1,
                 mId:id,
                 mname:song.songs[0].al.name,
                 userName:"网易用户"
               }
             }).then(res=>{
      //         console.log("网易用户模式歌曲播放记录添加成功")
             })
           }else{
            wx.cloud.callFunction({
              name:'upPlayCount_U',
              data:{
                mId:id,
                userName:"网易用户"
              }
            }).then(res=>{
      //        console.log("网易用户模式更新成功")
            })
           }
         })
      }
      else if(loginMode==2){
        wx.cloud.callFunction({
          name:'findRecentSong_I',
          data:{
            mId:id, //检索云数据库中播放记录是否有该条歌曲记录
            uid:String(wx.getStorageSync('openId'))
          }
        }).then(res=>{
    //      console.log(res)
          if(res.result.data.length==0)//在线歌曲加个歌曲id的字段，通过歌曲id字段检数据库中网络歌曲
          {
            wx.cloud.callFunction({
              name:'addRcentSongList_I',
              data:{
                bits:1,
                mpic:song.songs[0].al.picUrl,
                singer:song.songs[0].ar[0].name,
                uid:String(wx.getStorageSync('openId')),
                mname:song.songs[0].name,
                mId:id
              }
            }).then(res=>{
    //          console.log(res)
    //          console.log("添加成功")
            })
          }
          else
          {
           wx.cloud.callFunction({
             name:'upRsongList_I',
             data:{
               mId:id,
               uid:String(wx.getStorageSync('openId'))
             }
           }).then(res=>{
    //         console.log("更新成功")
           })
          }
         })
         //更新全局播放记录(用户模式)
         wx.cloud.callFunction({
           name:'findPlayCount_U',
           data:{
             mId:id,
             userName:"微信用户",
           }
         }).then(res=>{
           if(res.result.data.length==0)
           {
             wx.cloud.callFunction({
               name:'addPlayCount_U',
               data:{
                 bits:1,
                 mId:id,
                 mname:song.songs[0].al.name,
                 userName:"微信用户"
               }
             }).then(res=>{
      //         console.log("微信用户模式歌曲播放记录添加成功")
             })
           }else{
            wx.cloud.callFunction({
              name:'upPlayCount_U',
              data:{
                mId:id,
                userName:"微信用户"
              }
            }).then(res=>{
      //        console.log("微信用户模式更新成功")
            })
           }
         })
      }
    }
    else
    {//当前没有用户登录，只需要在一个歌曲播放列表中更新一下数据即可，用于统计功能
      wx.cloud.callFunction({
        name:'findPlayCount',
        data:{
          mId:id,
          userName:"游客"
        }
      }).then(res=>{
        if(res.result.data.length==0)
        {
          wx.cloud.callFunction({
            name:'addPlayCount',
            data:{
              bits:1,
              mname:song.songs[0].al.name,
              userName:"游客",
              mId:id
            }
          }).then(res=>{
     //       console.log("游客模式音乐播放记录添加完成")
          })
        }else{
          wx.cloud.callFunction({
            name:'upPlayCount',
            data:{
              mId:id,
              userName:"游客"
            }
          }).then(res=>{
    //        console.log("游客模式音乐播放记录更新成功")
          })
        }
      })
      
    }

     //对于部分音乐，比如纯音乐等，没有歌词的音乐数据，要处理一下
     if(lrc.lrc)//有这个字段
     {
       if(lrc.lrc.lyric==null)
       {
          this.setData({
            isLrc:false,
            lrcLoding:false
          })
       }else{
        this.setData({
          isLrc:true,
          lrcLoding:false
        })
        //有歌词数据且不是纯音乐的，再进行格式化歌词
       this.lrcFormat(lrc.lrc.lyric);
       }
     }else if(!lrc.lrc){
       if(lrc.nolyric)
       {
         console.log("纯音乐")
          this.setData({
            isLrc:false,
            lrcLoding:false
          })
       }
     }if(lrc.uncollected===true)//暂无歌词
     {
       console.log("当前歌曲没有歌词")
       this.setData({
         lrcIsNull:true,
         isLrc:false,
         lrcLoding:false
       })
     }
  },

  //歌词格式化
  lrcFormat(lrc){
    let res=[];//存放格式化之后的歌词数据
    let arr=lrc.split("\n");//以“\n”为标志进行切割
  //  console.log(lrc)
    let row=arr.length;//获取歌词的行数
    for(let i=0;i<row;i++)
    {
      let tmp_row=arr[i];//拿到当前下标的一行的数据
      let tmp_arr=tmp_row.split("]");//截取到每一行中歌词信息的时间单位最后一个符号
      let text=tmp_arr.pop();//完成分割之后，单独取出歌词内容,tmp_arr里面就只剩下[时间]
      tmp_arr.forEach(element=>{//时间转换为秒为单位
        let obj={};//用来存放新的歌词对象，对象以“时间，歌词”形式存储
        let time_arr=element.substr(1,element.length-1).split(":");//根据冒号进行分割，分为分钟和秒，从下标1开始，0为[，然后取到最长长度-1，也就是]之前
        let s=parseInt(time_arr[0])*60+Math.ceil(time_arr[1]);//冒号之前为分钟，之后为秒,分钟乘60，秒直接加（向上取整）
        obj.time=s;
        obj.text=text;
        res.push(obj);
      });
    }
  //  console.log(res)
    res.sort(this.sortRule)
  //  console.log(res)
    this.setData({
      lrc:res
    })
  },

  sortRule(a,b){//相当于升序排序，即a.time-b.time>0时，大的在前了，交换，反之不做交换
    return a.time-b.time
  },

  getLrc(){//根据当前播放进度，动态获取当前时间对应的歌词
    let j;
    for(j=0;j<this.data.lrc.length-1;j++)
    {
      if(this.data.lrcTime == this.data.lrc[j].time)
      {
//        console.log("歌词进来了~")
        this.setData({
          nowLrc:this.data.lrc[j].text
        })
      }if(j!=0)//第一句不处理
      {
        if(this.data.lrcTime>this.data.lrc[j-1].time&&this.data.lrcTime<this.data.lrc[j].time)//对于拖动进度条动作的歌词显示优化，优化了之前因拖动之后要等到到达对应下一句歌词时间才显示的问题
        {
          this.setData({
            nowLrc:this.data.lrc[j-1].text
          })
        }
      }
    }
  },

  //用户收藏(喜欢功能)
  async like(){
  //  console.log(this.data.index)
    let time=new Date()
    let likeTime=dayjs(time).format("YYYY-MM-DD HH:mm:ss")
    if(wx.getStorageSync('isLogin'))//当前有用户登录
    {
      let loginMode=wx.getStorageSync('loginMode')
      if(loginMode==1)//网易用户标志
      {
        let id=this.data.idList[this.data.index];//拿到当前下标的歌曲信息
        let url = await request('/song/url',{id:id}) //获取歌曲播放地址
        let song= await request('/song/detail',{ids:id}) //获取歌曲信息
        if(this.data.isLike)//当前音乐被用户所喜爱
        {
          this.setData({
            isLike:false 
          })
          //从中删除
          wx.cloud.callFunction({
            name:'removeLikeSong',
            data:{
              mId:id,
              uid:String(this.data.userInfor.userId)
            }
          }).then(res=>{
            wx.showToast({
              title: '取消收藏',
              icon:'none'
            })
          })
        }else{
          this.setData({
            isLike:true
          })
          wx.cloud.callFunction({
            name:'addLikeSong',
            data:{
                mpic:song.songs[0].al.picUrl,
                singer:song.songs[0].ar[0].name,
                uid:String(this.data.userInfor.userId),
                mname:song.songs[0].name,
                mId:id,
                likeTime:likeTime
            }
          }).then(res=>{
            wx.showToast({
              title: '添加到收藏',
              icon:'none'
            })
    //        console.log("网易用户喜爱歌曲添加成功")
          })
        }
      }else if(loginMode==2){//微信用户
        let id=this.data.idList[this.data.index];//拿到当前下标的歌曲信息
        let url = await request('/song/url',{id:id}) //获取歌曲播放地址
        let song= await request('/song/detail',{ids:id}) //获取歌曲信息
        if(this.data.isLike)//当前音乐被用户所喜爱
        {
          this.setData({
            isLike:false 
          })
          //从中删除
          wx.cloud.callFunction({
            name:'removeLikeSong',
            data:{
              mId:id,
              uid:String(wx.getStorageSync('openId'))
            }
          }).then(res=>{
            wx.showToast({
              title: '取消收藏',
              icon:'none'
            })
          })
        }else{
          this.setData({
            isLike:true
          })
          wx.cloud.callFunction({
            name:'addLikeSong',
            data:{
                mpic:song.songs[0].al.picUrl,
                singer:song.songs[0].ar[0].name,
                uid:String(wx.getStorageSync('openId')),
                mname:song.songs[0].name,
                mId:id,
                likeTime:likeTime
            }
          }).then(res=>{
            wx.showToast({
              title: '添加到收藏',
              icon:'none'
            })
    //        console.log("微信用户喜爱歌曲添加成功")
          })
        }
      }
    }else{
      wx.showToast({
        title: '需要登录之后才能进行收藏哦~',
        icon:'none'
      })
    }
  },

  //播放、暂停按钮逻辑功能：
  toPlay(e){
    this.setData({
      isPlay:!this.data.isPlay
    });
    if(this.data.isPlay){
      bg.play();
    //  app.globalData.isPlay=this.data.isPlay
    }else{
      bg.pause();
    //  app.globalData.isPlay=this.data.isPlay
    }
  }, 

  nextII(){//单曲循环的独立切歌功能，不执行切歌，执行当前歌曲重新播放
    console.log("单曲模式下歌曲播放完毕自动播放")
    this.setData({
      lrcLoding:true,
      lrc:[],
      nowLrc:"",
      nowTime:"00:00",
      totalTime:"00:00",
      isPlay:false
    })
    let tmp=this.data.index;
    this.setData({
      index:tmp,
      isPlay:true,
      isNext:true,
      isPre:false,
    //  isType:true,
      end:true
    })
    this.getSongDe()
  }, 

  //下一首
  next(){
    this.setData({
      lrcLoding:true,
      lrc:[],
      nowLrc:"",
    //  tap:true,
      nowTime:"00:00",
      totalTime:"00:00",
      isPlay:false
    })
    let tmp;
    if(this.data.playMode===0)//顺序播放
    {
      tmp=this.data.index+1;
      if(tmp===this.data.idList.length){
        tmp=0;
      }
    }else if(this.data.playMode===1)//单曲循环
      {
      /*  tmp=this.data.index;
        this.setData({
          isType:true
        })
        bg.stop(); */
        tmp=this.data.index+1;
        if(tmp===this.data.idList.length){
          tmp=0;
        }
      /*  this.setData({
          isType:true
        }) */
      // console.log(this)
      //  this.playMusic();//循环播放的地址是一样的，所以直接在这里再次调用一次播放
      }else{
        tmp=this.data.index
      //  console.log(tmp)
        let tmpp=parseInt(Math.random()*this.data.idList.length);
        if(tmp==tmpp)
        {
          while(tmp==tmpp)
          {
        //    console.log("相同了，再次生成随机数")
            tmpp=parseInt(Math.random()*this.data.idList.length);
          }
        }
      //  console.log(tmpp)
        tmp=tmpp
      }
      this.setData({
        index:tmp,
        isPlay:true
      })
      this.setData({
        isNext:true,
        isPre:false
      })
      this.getSongDe();//重新获取音乐
  },

  //上一首
  last(){
    this.setData({
      lrcLoding:true,
      lrc:[],
      nowLrc:"",
    //  tap:true,
      nowTime:"00:00",
      totalTime:"00:00",
      isPlay:false
    })
    let tmp;
    if(this.data.playMode===0)//顺序播放
    {
      tmp=this.data.index-1;
      if(tmp<0){
        tmp=this.data.idList.length-1;
      }
    }else if(this.data.playMode===1)//单曲循环
      {
      /*  tmp=this.data.index;
        this.setData({
          isType:true
        })
        bg.stop(); */
      //  this.playMusic();
        tmp=this.data.index-1;
        if(tmp<0){
          tmp=this.data.idList.length-1;
        } 
      /*  this.setData({
          isType:true
        }) */
      }else{//随机模式
        tmp=this.data.index
        let tmpp=parseInt(Math.random()*this.data.idList.length);
        if(tmp==tmpp)
        {
          while(tmp==tmpp)
          {
          //  console.log("相同了，再次生成随机数")
            tmpp=parseInt(Math.random()*this.data.idList.length);
          }
        }
        tmp=tmpp
      }
      this.setData({
        index:tmp,
        isPlay:true
      })
      this.setData({
        isNext:false,
        isPre:true
      })
      this.getSongDe();//重新获取音乐基本数据并初始化背景音乐接口
  },

  //播放模式切换
  changePlayMode(){
    let tmp=this.data.playMode+1
//    let tmp=wx.getStorageSync('playMode')+1;//使用全局变量
    if(tmp>2)
    {
      tmp=0;
    }
    if(tmp===0)
    {
      wx.showToast({
        title: '切换为顺序播放',
        icon:'success'
      })
    }
    if(tmp===1)
    {
      wx.showToast({
        title: '切换为单曲循环',
        icon:'success'
      })
    }
    if(tmp===2)
    {
      wx.showToast({
        title: '切换为随机播放',
        icon:'success'
      })
    }
/*    this.setData({
      playMode:tmp
    }) */
    wx.setStorageSync('playMode',tmp);
    this.setData({
      playMode:wx.getStorageSync('playMode')
    })
  },

  playMusic(){//初始化背景音乐api数据
    this.setData({
      isPlay:true
    })
    console.log("播放",this.data.urlDet.url,this.data.songDet.name);
    bg.src=this.data.urlDet.url;
    bg.title=this.data.songDet.name;
 //   console.log("背景音乐初始化完毕")
 //   console.log(bg)
    return ;
 //   console.log("进度条",bg.duration);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //定时器更新：
  updateTime(){
    if(!this.data.isPlay||this.data.isSlider) return;//如果当前没有音乐正在播放或者有音乐播放但没有进行进度条拖拽的时候，便不做更新动作，背景音乐所获取到的时间单位为毫秒
    let nowTime=bg.currentTime;//获取当前音乐播放时间
    let totalTime=bg.duration;//获取当前音乐的总时长
    let value=bg.currentTime;//更新滑动组件的位置
    let max=bg.duration;
    let lrcTime=Math.ceil(bg.currentTime);
    if(this.data.lrc.length!=0)//歌词加载完毕时
    {
      let len=this.data.lrc.length//拖动进度歌词显示bug处理
  //    console.log(len)
      let lrcTotalTime=this.data.lrc[len-1].time//拿到歌词数组中最后一组歌词对应的时间
      if(nowTime>lrcTotalTime)//如果当前歌曲进度时长大于歌词数组最大时间
      {
        if(this.data.nowLrc!=="")
        {
          this.setData({
            nowLrc:""
          })
        }
      }
    }
    if(nowTime && totalTime)//当前正有歌曲在播放的时候，每三毫秒更新一次数据
    {
      totalTime=moment(totalTime*1000).format('mm:ss');
      nowTime=moment(nowTime*1000).format('mm:ss');
 //     console.log("Time tow:",totalTime,nowTime);
      //修改值播放页面的所有数据：
      this.setData({
        nowTime:nowTime,//当前进度时间
        totalTime:totalTime,//歌曲总时长
        max:max,//Slider最大长度
        value:value,//进度条的当前实时长度
        lrcTime:lrcTime//歌曲对应实时时间
      })
      if(bg.duration>35)//不是试听版本音乐
      {
        this.setData({
          isDemo:false
        })
        this.getLrc();//更新当前播放进度中的歌词位置
      }else{//试听音乐
        this.setData({
          isDemo:true
        })
      } 
      
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    timeId=setInterval(()=>{
      this.updateTime();
    },400)
    let mode=wx.getStorageSync('playMode');
  //  console.log(mode)
    this.setData({
      playMode:mode
    })
    if(wx.getStorageSync('isLogin'))//当前如果有用户登录
    {
      if(wx.getStorageSync('loginMode')==1)//网易用户模式
      {
    //    console.log("网易用户收藏模式进来了")
        let userInfor=wx.getStorageSync('userInfor');
        if(userInfor)
        {
          this.setData({
          userInfor:JSON.parse(userInfor)
          })
        }
        let id=this.data.idList[this.data.index];//拿到当前下标的歌曲信息
        wx.cloud.callFunction({
          name:'findLikeSong',
          data:{
            mId:id,
            uid:String(this.data.userInfor.userId),
          }
        }).then(res=>{
    //      console.log(res)
          if(res.result.data.length==0)
          {
            this.setData({
              isLike:false
            })
          }else{
            this.setData({
              isLike:true
            })
          }
        })
      }else if(wx.getStorageSync('loginMode')==2){
//        console.log("微信用户收藏模式进来了")
        let id=this.data.idList[this.data.index];//拿到当前下标的歌曲信息
        let uid=wx.getStorageSync('openId')
//        console.log(id)
//        console.log(uid)
        wx.cloud.callFunction({
          name:'findLikeSong',
          data:{
            mId:id,
            uid:uid
          }
        }).then(res=>{
//          console.log(res)
          if(res.result.data.length==0)
          {
            this.setData({
              isLike:false
            })
          }else{
            this.setData({
              isLike:true
            })
          }
        })
      }
    }
  },

  //预览图片
  previewImage(){
    wx.previewImage({
      urls:[this.data.songDet.al.picUrl],
      current:this.data.songDet.al.picUrl
    })
  },

  saveImage(){//真机调试的时候不需要这步，直接通过查看图片的api可以进行保存图片，这里是用于电脑调试使用的
    let url=this.data.songDet.al.picUrl//先拿到当前图片的网络路径
    wx.getSetting({
      success:(res)=>{
        if(!res.authSetting['scope.writePhotosAlbum']){
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success:()=>{
              this.saveIma(url)//同意授权时，进行存储图片
            },
            fail:(res)=>{
              wx.showToast({
                title: '需要授权才能保存哦~',
                icon:'none'
              })
            }
          })
        }else{//已经授权过了
          this.saveIma(url)
        }
      },
      fail:(res)=>{
        console.log(res)
      }
    })
  },

  saveIma(imageUrl){
    wx.getImageInfo({//将网络图片地址转换为本地地址
      src: imageUrl,
      success:(res)=>{
        console.log(res)
        let path=res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success:(res)=>{
            wx.showToast({
              title: '保存成功~',
              icon:'success'
            })
          },
          fail:(res)=>{
            wx.showToast({
              title: '错误，请稍候再试',
              icon:'none'
            })
          }
        })
      },
      fail:(err)=>{
        console.log(err)
      }
    })
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
    clearInterval(timeId);//销毁计时器
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
  onShareAppMessage: function ({from}) {
    if(from==='menu')
    {
      return{
        title:this.data.songDet.name,
        page:'/pages/index/index',
        imageUrl:this.data.songDet.al.picUrl
      }
    }
  }
})