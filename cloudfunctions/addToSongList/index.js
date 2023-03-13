// 云函数入口文件，添加歌曲至歌曲库中
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("SongList").add({
      data:{
        mId:event.mId,
        mname:event.mname,
        singer:event.singer,
        type:event.type,
        picUrl:event.picUrl
      }
    }).then()
  }catch(e)
  {
    return e
  }
}