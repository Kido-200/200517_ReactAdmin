/*
包含n各action creator函数的模块
同步action：对象{type:'xx',data:数据值}
异步action: 函数 dispatch => {}
*/
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER
} from './action-types'
import {reqLogin} from '../api'
import storageUtils from '../utils/storageUtils'
//设置头部标题的同步action
export const setHeadTitle = (headTitle) => ({type:SET_HEAD_TITLE,data:headTitle})

//接受用户的同步action
export const receive_user = (user) => ({type:RECEIVE_USER,user})

//显示错误信息的同步action
export const showErrorMsg = (errorMsg) => ({type:SHOW_ERROR_MSG,errorMsg})

//退出登陆
export const logout = () => {
    //删除local中的user
    storageUtils.removeUser()
    //返回action对象
    return {type:RESET_USER}
}


//登陆的异步action
export const login = (username,password) =>{
    return async dispatch =>{
        //1.执行异步ajax请求
        const result = await reqLogin(username,password) //{status:0,data:user}
        //2.如果成功了，分发成功的同步action
        if(result.status===0){
            const user = result.data;
            // console.log(result);
            //保存到local中
            storageUtils.saveUser(user)
            //分发接受用户的同步action
            dispatch(receive_user(user))
        }
        //失败了，分发失败的同步action
        else{
            const msg = result.msg
            dispatch(showErrorMsg(msg))
        }
    }
}