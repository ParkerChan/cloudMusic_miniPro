// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db=cloud.database();
const _=db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try{
   return await db.collection("userSongList").where({
     uid:event.uid,
     mId:event.mId,
     listName:event.listName
   }).update({
      data:{
        coverImgUrl:event.coverImgUrl
      }
    }).then()
  }catch(e)
  {
    return e
  }
}