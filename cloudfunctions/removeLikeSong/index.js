// 云函数入口文件
//当前云函数实现没有用户登录，只要播放就记录一下播放歌曲，便于后面的统计功能使用
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("userLikeList").where({
      mId:event.mId,
      uid:event.uid
    }).remove().then()
  }catch(e)
  {
    return e
  }
}