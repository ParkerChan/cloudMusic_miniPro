// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
let uId=""

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.uid)
  uId=event.uid
  let count=await getCount()
  count=count.total;
  let list=[]
  for(let i=0;i<count;i+=100)
  {
    list=list.concat(await getList(i))
  }
  return list
 /* try{
    return await db.collection("userLikeList").where({
      uid:event.uid
    }).orderBy("likeTime","desc").get().then(res=>{
      return res;
    })
  }catch(e)
  {
    return e
  }*/
}
async function getCount(){//获取到总数据
  let count = await db.collection("userLikeList").where({
    uid:uId
  }).count();
  return count
}
async function getList(skip)//分段获取
{
  let list=await db.collection("userLikeList").where({
    uid:uId
  }).orderBy("likeTime","desc").skip(skip).get();
  return list.data
}