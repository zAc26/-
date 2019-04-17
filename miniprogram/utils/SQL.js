
function update(dataBase, id, data) {

  const db = wx.cloud.database()
  db.collection(dataBase).doc(id).update({
    data: data,
    success: res => {
      console.log('[数据库' + dataBase + '] [更新记录] 成功：', res)
    },
    fail: err => {
      icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
    }
  })
}


/*addSQLPlus 先验证是否存在，查重
*查到后执行fn(res)
* res.data 为结果集数组
 */
function delById(dataBase, id) {
  if (id) {
    const db = wx.cloud.database()
    db.collection(dataBase).doc(id).remove({
      success: res => {
        console.log('[数据库:' + dataBase + '] [删除记录:id=' + id + '] 成功：', res)
      },
      fail: err => {
        console.error('[数据库:' + dataBase + '] [删除记录:id=' + id + '] 失败：', err)
      }
    })
  } else {
    console.log('无记录可删，请见创建一个记录')
  }
}

function queryPlus(dataBase, query, fn) {
  if (fn == null) fn = function (res) { console.log(res) }

  const db = wx.cloud.database()
  const _ = db.command
  // 查询当前用户所有的 counters
  db.collection(dataBase).where(query(_)).get({
    success: res => {
      console.log('[数据库:' + dataBase + '] [查询记录] 成功: ', res)
      fn(res)
    },
    fail: err => {
      console.error('[数据库:' + dataBase + '] [查询记录] 失败：', err)
    }
  })

}


function query(dataBase, query, fn, i) {
  if (fn == null) fn = function (res) { console.log(res) }

  const db = wx.cloud.database()

  // 查询当前用户所有的 counters
  db.collection(dataBase).where(query).get({
    success: res => {
      console.log('[数据库:' + dataBase + '] [查询记录] 成功: ', res)
      fn(res, i)
    },
    fail: err => {
      console.error('[数据库:' + dataBase + '] [查询记录] 失败：', err)
    }
  })
}

/**
 *  查重
 * 新增
 * 新增后执行 fn(_id)
 * _id ：新增记录的id
 */
function addSQLPlus1(dataBase, data, fn) {
  const db = wx.cloud.database()
  db.collection(dataBase).where(data).get({
    success: res => {
      console.log('[数据库:' + dataBase + '] [查询记录] 成功: ', res)
      if (res.data.length > 0) {
        console.log('[发现该数据为重复数据]: ', res.data)
        fn(res.data[0]._id)

      }
      else {
        db.collection(dataBase).add({  //开始新增
          data: data,
          success: res => {
            console.log('[数据库:' + dataBase + '] [新增记录] 成功，记录 _id: ', res._id)
            fn(res._id)
          },
          fail: err => {
            console.error('[数据库:' + dataBase + '] [新增记录] 失败：', err)
          }
        })
      }
    },
    fail: err => {
      console.error('[数据库:' + dataBase + '] [查询记录] 失败：', err)
    }
  })
}

/**
 * 查重
 * 新增
 */
function addSQLPlus(dataBase, data) {//
  const db = wx.cloud.database()

  db.collection(dataBase).where(data).get({
    success: res => {
      console.log('[数据库:' + dataBase + '] [查询记录] 成功: ', res)
      if (res.data.length > 0) {
        console.log('[这玩意儿已经存在了 ', res.data.length)
        return res.data[0]._id
      }
      else {
        db.collection(dataBase).add({  //开始新增
          data: data,
          success: res => {
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            return res._id
          },
          fail: err => {
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      }
    },
    fail: err => {
      console.error('[数据库] [查询记录] 失败：', err)
    }
  })
}
/*
*新增
addSQL
 */
function addSQL(dataBase, data, fn) {
  if (fn == null) fn = function (res) { console.log(res) }
  const db = wx.cloud.database()
  db.collection(dataBase).add({
    data: data,
    success: res => {
      console.log('[数据库' + dataBase + '] [新增记录] 成功，记录 _id: ', res._id)
    },
    fail: err => {
      console.error('[数据库]' + dataBase + ' [新增记录] 失败：', err)
    }
  })
}

module.exports = {

  addSQL: addSQL,
  addSQLPlus: addSQLPlus,
  addSQLPlus1: addSQLPlus1,
  query: query,
  queryPlus: queryPlus,
  delById: delById,
  update: update
}