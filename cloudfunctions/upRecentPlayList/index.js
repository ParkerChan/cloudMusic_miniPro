// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db=cloud.database();
const _=db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try{
   return await db.collection("recentPlayList").doc(event._id).update({
      data:{
        bits:_.inc(1),
        playTime:db.serverDate()
      }
    }).then()
  }catch(e)
  {
    return e
  }
}