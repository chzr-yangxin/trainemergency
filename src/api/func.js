import request from '@/utils/request'

export function getRoles() {
    return request({
        url: '/subway/roles',
        method: 'get'
    })
}

export function getSession(data) {
    return request({
        url: '/subway/session',
        method: 'get',
        params: data
    })
}

export function computerlogin(roleid) {
    return request({
        url: '/subway/computer/' + roleid,
        method: 'get'
    })
}

export function alltasks() {
    return request({
        url: '/subway/task',
        method: 'get'
    })
}

export function sendTask(taskid) {
    return request({
        url: '/subway/sendtask/' + taskid,
        method: 'post'
    })
}


export function allusers(pageindex, pagesize) {
    return request({
        url: '/subway/users',
        method: 'get',
        params: { pageindex, pagesize }
    })
}

export function adduser(form) {
    return request({
        url: '/subway/user',
        method: 'post',
        data: form
    })
}

export function updateuser(userid, form) {
    return request({
        url: '/subway/user/' + userid,
        method: 'post',
        data: form
    })
}

export function deleteuser(userid) {
    return request({
        url: '/subway/user/' + userid,
        method: 'delete'
    })
}

export function allResults(pageindex, pagesize) {
    return request({
        url: '/subway/results',
        method: 'get',
        params: { pageindex, pagesize }
    })
}

export function getResultDetail(checkid) {
    return request({
        url: '/subway/taskdetail/' + checkid,
        method: 'get'
    })
}

export function getRnningTask() {
    return request({
        url: '/subway/runtask',
        method: 'get'
    })
}
export function getLastFinishTask() {
    return request({
        url: '/subway/lasttask',
        method: 'get'
    })
}
////
export function getMyTask(checkid) {
    return request({
        url: '/subway/mytask',
        method: 'get'
    })
}

export function scoreTask(resid, score) {
    return request({
        url: '/subway/taskscore/' + resid,
        method: 'get',
        params: {score: score}
    })
}