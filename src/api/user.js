import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/subway/login',
    method: 'get',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/subway/userinfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/subway/userlogout',
    method: 'post'
  })
}
