/*
这是一个能发送异步ajax请求的函数模块
封装fetch
函数返回值是promise对象

*/


import {fetch} from 'whatwg-fetch'


/*
    将对象转成 a=1&b=2的形式
    @param obj 对象
*/

function obj2String(obj) {
    var urlencoded = new URLSearchParams();
    for (let item in obj) {
        if(obj[item] instanceof Array)
           {
               for(var i = 0;i<obj[item].length;i++)
               {
                urlencoded.append(item, obj[item][i]);
               }
        // console.log('SHIT',obj[item] instanceof Array,item)
        //这个append一个数组有问题 ,会直接append进去这数组组成的字符串，用，连接
        // console.log('OBJ',obj[item])
        //数组里套数组我感觉是不大可能发生了，这样应该差不多了
        //要是有这样的需求就只能额外写个函数去递归调用了,还要把urlencoded层层传下去
           }
        else{
            urlencoded.append(item, obj[item])
        }

      }
      return urlencoded
      //URLSearchParams(arr)返回一个URLSearchParams对象
      // URLSearchParams.toString()返回搜索参数组成的字符串，可直接使用在URL上。
      //格式就是 'xx=xx&aa==bb',给GET用的
      //URLSearchParams是可以直接给POST用的
    }

//返回一个数据对象（res.json()转化成他的,注意这个函数不是生成一个json对象，而是先text()再parse()转成的数据对象)的Promise对象

export default function ajax(url,data={},method='GET'){


/*
优化：统一处理请求异常
在外层包一个自己创建的promise对象
在请求出错时不reject(error)，而是显示错误提示
这样，返回的Promise对象状态不可能是出错的了，要么是pendding要么是successed,就不需要.catch去看这个fetch命令是否出错了。
但我暂时不打算用这个。
*/
    // return new Promise((resolve,reject)=>{
    //     let initObj = {};

    // if(method==='GET')
    // {
    //     const searchStr = obj2String(data).toString();
    //    url+='?'+searchStr;
    //    //url?xx=xx&bb=aa 是这样的
    //     initObj = {
    //         method:method,
    //         credetial:'include'
    //     }
    // }
    // else{
    //     const searchStr = obj2String(data);
    //     initObj = {
    //         method:method,
    //         credetial:'include',
    //         headers: new Headers({
    //             'Accept': 'application/json',//表示我想要接受的数据类型
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         }),
    //         body: searchStr
    //     }
    // }
    // let promise = fetch(url,initObj)
    // promise.then( response => {
    //     resolve(response)//把状态设定为成功并返回reponse的Promise对象
    // }).catch(error=>{
    //     //fetch失败了
    //     message.error('请求出错了'+error.message)
    // })

    // })
    let initObj = {};

    if(method==='GET')
    {
        const searchStr = obj2String(data).toString();
       url+='?'+searchStr;
       //url?xx=xx&bb=aa 是这样的
        initObj = {
            method:method,
            credetial:'include'
        }
    }
    else{
        const searchStr = obj2String(data);
        initObj = {
            method:method,
            headers: new Headers({
                'Accept': 'application/json',//表示我想要接受的数据类型
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: searchStr
        }
    }
    return fetch(url,initObj).then((res)=>{
        return res.json()
    })
}

// //请求登陆接口
// ajas('/login',{username:'Tom',password:'12345'},'POST').then()
// 添加用户
// ajax('/manage/user/add',{username:'Tom',password:'12345',phone:'13057559392'},'POST').then()