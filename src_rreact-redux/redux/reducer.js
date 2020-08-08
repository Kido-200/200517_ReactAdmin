/*
根据当前state和指定的action返回一个新的state
*/
import {INCREMENT,DECREMENT} from './action-types'
// import {combineReducers} from 'redux'
import {combineReducers} from '../lib/redux'

function count(state = 1,action){
    switch (action.type){
        case INCREMENT:
            return state + action.data
        case DECREMENT:
            return state - action.data
        default:
            return state
    }
}

/*
管理user状态数据的reducer
*/
const initUser = {}
function user(state = initUser,action)
{
    switch(action.type){
        default:
            return state
    }
}

//combineReducers函数：接受包含所有reducer函数的对象，返回一个新的reducer函数(总reducer)
export default combineReducers({
    count,
    user
})