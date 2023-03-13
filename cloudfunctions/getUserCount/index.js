// 获取每种用户播放记录中播放次数最高的三首歌
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.uid)
  try{
    return await db.collection("playCount").where({
      userName:event.userName
    }).orderBy("bits","desc").limit(3).get().then(res=>{
      return res;
    })
  }catch(e)
  {
    return e
  }
}