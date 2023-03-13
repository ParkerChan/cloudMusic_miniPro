// 云函数入口文件,拿到用户所有评价
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("userSay").orderBy("sendTime","desc").get().then(res=>{
      return res
    })
  }catch(e)
  {
    return e
  }
}