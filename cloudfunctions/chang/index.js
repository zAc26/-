// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // 先取出集合记录总数                          
  const dataBase = event.DB
  const id = event.id
  const data = event.DD
  const promise = db.collection(dataBase).doc(id).update({
    data: data,
  })
  return promise
}