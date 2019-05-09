const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()


exports.main = async (event, context) => {
    // 先取出集合记录总数                          
    const dataBase = event.DB
    const   id = event.id
    return db.collection(dataBase).where(id).remove()
  }