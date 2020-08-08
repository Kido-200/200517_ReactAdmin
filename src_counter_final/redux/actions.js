/*
包含n个用来创建action的工厂函数(action creator)
*/
import {INCREMENT,DECREMENT} from './action-types'


//增加的action
export const increment = number => ({type:INCREMENT,data:number})
//减少的action
export const decrement = number => ({type:DECREMENT,data:number})

//增加的异步action：返回的是函数  ，上面都是action对象
export const incrementAsync = number => {
    return dispatch => {
        //1.执行异步(定时器，ajax请求，promise)
        setTimeout(() => {
            //2.当异步任务执行完成时，分发一个同步action
            dispatch(increment(number))
        }, 1000);
    }
}
