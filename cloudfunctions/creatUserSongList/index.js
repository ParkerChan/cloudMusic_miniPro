// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("userSongList").add({
      data:{
        uid:event.uid,
        listName:event.listName,
        coverImgUrl:event.coverImgUrl
      }
    }).then(res=>{
      return res
    })
  }catch(e)
  {
    return e
  }
}