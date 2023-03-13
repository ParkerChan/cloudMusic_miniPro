// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("recentPlayList").add({
      data:{
        bits:event.bits,
        mpic:event.mpic,
        singer:event.singer,
        uid:event.uid,
        mname:event.mname,
        playTime:db.serverDate(),
        mId:event.mId
      }
    }).then()
  }catch(e)
  {
    return e
  }
}