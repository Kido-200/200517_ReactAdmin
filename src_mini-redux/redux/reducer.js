/*
根据当前state和指定的action返回一个新的state
*/
// import {combineReducers} from 'redux'
import {combineReducers} from '../lib/redux'
import {INCREMENT,DECREMENT} from './action-types'

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

function user (state={},action){
    switch (action.type){
        default:
            return state
    }
}

/*
返回一个整合后的总的reducer


*/
export default combineReducers({
    count,
    user
})