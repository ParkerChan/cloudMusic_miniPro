// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.uid)
  try{
    return await db.collection("playCount").where({
      userName:event.userName
    }).get().then(res=>{
      return res;
    })
  }catch(e)
  {
    return e
  }
}