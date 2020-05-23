/*
包含应用中所有接口请求函数的模块
返回Promise对象
因为这个是5000端口的服务器，跨域了，所以要改
*/

import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'


//登陆
export const reqLogin =  (username,password) => ajax('/login',{username,password},'POST')

//添加用户
export const reqAdd = (user) => ajax('/manage/user/add',user,'POST')


// jsonp的请求的接口请求函数
export const reqWeather = (city)=>{
    return new Promise((resolve,reject)=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url,{},(err,data)=>{
            // console.log('jsonp()',err,data)
            if(!err&&data.status==='success')
                {
                   const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                    resolve({dayPictureUrl,weather})
                }
            else{
                    //失败了
                    message.error('获取天气信息失败！')
                }
        })
    })
   
}
// reqWeather('北京')