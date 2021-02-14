import request from '@/utils/request'

export default {

    //1 讲师列表（条件分页查询）
    getTeacherList(current, limit, teacherQuery){
        return request({
            //url: '/pageTeacherCondition/'+current+"/"+limit,
            url: `/eduService/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            data: teacherQuery
          })
    },
    //删除讲师
    removeById(id) {
        return request({
            //url: '/pageTeacherCondition/'+id+"/"+limit,
            url: `/eduService/teacher/delete/${id}`,
            method: 'DELETE'
          })
    },
    //添加讲师
    save(teacher) {
        return request({
            //url: '/pageTeacherCondition/'+id+"/"+limit,
            url: `/eduService/teacher/addTeacher`,
            method: 'post',
            data : teacher
          })
    },
    getTeacherInfo(id) {
        return request({
            url: `/eduService/teacher/getById/${id}`,
            method : 'get'
        })
    },
    updateTeacherInfo(id,teacher){
        return request({
            url: `/eduService/teacher/updateById/${id}`,
            method : 'put',
            data : teacher
        })
    }
}