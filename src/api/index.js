/*
包含应用中所有接口请求函数的模块
返回Promise对象
因为这个是5000端口的服务器，跨域了，所以要改
*/

import ajax from './ajax'


//登陆
export const reqLogin =  (username,password) => ajax('/login',{username,password},'POST')

//添加用户
export const reqAdd = (user) => ajax('/manage/user/add',user,'POST')