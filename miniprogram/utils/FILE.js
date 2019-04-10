
function delPic(url) {

  var path = url.replace('https://636c-cloudclassroom-7d6098-1258597894.tcb.qcloud.la/', '')
  path = '636c-cloudclassroom-7d6098 /' + path  /*****************/
  console.log('正在删除' + path + '...')
  wx.cloud.deleteFile({
    fileList: [path],
    success: res => {
      // handle success
      console.log("删除成功：", res.fileList)
    },
    fail: console.error
  })
}

/**
 * 上传图片 完成后对
 * URL进行 fn
 */
function uploadPic(filePath, cp, picName, fn) {
  // 上传图片   "image/courseImage/"

  const cloudPath = cp + picName + filePath.match(/\.[^.]+?$/)[0]
  console.log('[上传图片]....：\n filePath"' + filePath + "\ncloudPath:" + cloudPath)
  wx.cloud.uploadFile({
    cloudPath,
    filePath,
    success: res => {
      console.log('[上传图片] 成功：', res)

      var fileID = res.fileID
      getTempFileURL(fileID, fn)


    },
    fail: e => {
      console.error('[上传图片] 失败：', e)
      wx.showToast({
        icon: 'none',
        title: '上传失败',
      })
    },
  })
}
/**
 * 所谓的getTempFileURL
 * 获取一个文件的。。。
 * 后操作 fn（tempFileURL）
 */
function getTempFileURL(cloudPath, fn) {
  if (fn == null) fn = function (res) { console.log(res) }
  wx.cloud.getTempFileURL({
    fileList: [cloudPath],
    success: res => {
      console.log("换取文件URL成功", res)
      fn(res.fileList[0].tempFileURL)
    },
    fail: console.error
  })


}

module.exports = {
  getTempFileURL: getTempFileURL,
  uploadPic: uploadPic,
  delPic: delPic
}