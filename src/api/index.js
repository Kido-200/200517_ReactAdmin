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

//一般查询是GET 会更新数据的是POST
//获取一级/二级分类的列表
export const reqCategorys = (parentId)=>ajax('/manage/category/list',{parentId},'GET')
//添加分类
export const reqAddCategory = (categoryName,parentId)=>ajax('/manage/category/add',{categoryName,parentId},'POST')
//更新分类名称
export const reqUpdateCategory = ({categoryId,categoryName})=>ajax('/manage/category/update',{categoryId,categoryName},'POST')


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
                    console.log(err)
                    message.error('获取天气信息失败！')
                }
        })
    })
   
}

//获取商品分页列表
//searchType的值为productName/productDesc
export const reqProducts = (pageNum,pageSize) => ajax('/manage/product/list',{pageNum,pageSize},'GET')

//搜索商品分页列表
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=> ajax('/manage/product/search',{
    pageNum,
    pageSize,
   [searchType]:searchName
   //[]的意思是将searchType的值作为属性名
},'GET')

//删除图片
export const reqDeleteImg = (name)=> ajax('/manage/img/delete?name',{name},'POST')

//添加商品 更新商品
export const reqAddOrUpdateProduct = (product)=> ajax('/manage/product/'+(product._id?'update':'add'),product,'POST')

//根据id获取分类
export const reqCategory = (categoryId) => ajax('/manage/category/info',{categoryId},'GET')

//更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId ,status) => ajax('/manage/product/updateStatus',{productId ,status},'POST')

//获取所有角色的列表
export const reqRoles = () => ajax('/manage/role/list',{},'GET')

//添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add',{roleName},'POST')

//更新角色
export const reqUpdateRole = (role) => ajax('/manage/role/update',role,'POST')

//获取所有用户列表
export const reqUser = () => ajax('/manage/user/list')

//删除指定用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete',{userId},'POST')

//添加用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/'+(user._id?'update':'add'),user,'POST')
