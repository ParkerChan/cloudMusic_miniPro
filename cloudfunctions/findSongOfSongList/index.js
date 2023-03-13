// 云函数入口文件，查找音乐库中当前需要添加音乐是否已经存在
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("SongList").where({
      mId:event.mId
    }).get().then(res=>{
      return res
    })
  }catch(e)
  {
    return e
  }
}