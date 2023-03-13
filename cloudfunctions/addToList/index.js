// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("userSongListDetail").add({
      data:{
        mId:event.mId,
        listName:event.listName,
        uid:event.uid,
        mname:event.mname,
        singer:event.singer,
        addTime:event.addTime
      }
    }).then()
  }catch(e)
  {
    return e
  }
}