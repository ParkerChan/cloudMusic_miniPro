// 云函数入口文件，添加歌曲至歌曲库中

const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("rootMessage").add({
      data:{
        pic:event.pic,
        rootName:event.name,
        uid:event.uid,
        title:event.title,
        content:event.content,
        messageTime:event.messageTime
      }
    }).then()
  }catch(e)
  {
    return e
  }
}