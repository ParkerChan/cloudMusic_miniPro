// 云函数入口文件,拿到歌曲库的所有歌曲
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("rootMessage").orderBy("messageTime","desc").get().then(res=>{
      return res
    })
  }catch(e)
  {
    return e
  }
}