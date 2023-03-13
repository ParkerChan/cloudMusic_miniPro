import config from './config'

export default (url,data={},method='GET')=>{
  return new Promise((resolve,reject)=>{

    wx.request({
      url:config.host+url,
      data,
      method,
      header:{
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U')!==-1):''
      },
      success:(res)=>{
 //       console.log('请求成功',res);
        if(url==='/login/cellphone')
        {
          wx.setStorage({
            key:'cookies',
            data:res.cookies
          })
        }
        resolve(res.data);//修改promise状态为成功状态
      },
      fail:(err)=>{
//        console.log('请求失败:',err);
        reject(err);//修改promise状态为失败状态
      }
    })

  })
}