const SQL = require("SQL.js");
const FILE = require('FILE.js')

function getStuByCourseId(courseId, fn) {
  var stuList = []

  var count = 0
  SQL.query('cla_course', {
    course_id: courseId
  }, function (res) {
    //循环查找
    var list = res.data
    for (var i = 0; i < list.length; i++) {
      SQL.query('user', {
        cla_id: list[i].cla_id,
        power: 2
      },
        function (res1) {
          count++
          var temlist = res1.data
          for (var j = 0; j < temlist.length; j++) {
            stuList.push(temlist[j])
          }

          if (count == list.length) {
            console.log('共'+count+"个班(p)", stuList)
            fn(stuList)
          }
        })
    }
  })
}


function delCourseById(id) {
  console.log('0. delCourseById("'+id+'") ')
  //1.查询有这个id 的cla_course
  SQL.query('cla_course', {
    course_id: id
  },
    function (res) {
      console.log('1.准备删除 cla_course '+res.data)
      //2.循环删除
      var list = res.data
      console.log('2.正在删除cla_course （共' + list.length + '条）')
      for (var i = 0; i < list.length; i++)
        SQL.delById('cla_course', list[i]._id)


      //3.删除该课程的图片
      SQL.query('course', { _id: id }, function (res) {
        console.log('3.正在删除图片 ' + res.data[0].url)
        FILE.delPic(res.data[0].url)
        //4.删除该课程
        console.log('4.正在删除course ' + id)
        SQL.delById('course', id)
      })

    })
}

module.exports = {

  delCourseById: delCourseById,
  getStuByCourseId: getStuByCourseId
}