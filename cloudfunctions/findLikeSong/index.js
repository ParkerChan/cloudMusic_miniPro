// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("userLikeList").where({
      mId:event.mId,
      uid:event.uid
    }).get().then(res=>{
      return res
    })
  }catch(e)
  {
    return e
  }
}