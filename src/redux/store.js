/*
redux最核心的管理对象store
*/
import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import reducer from './reducer'

//向外默认暴露store
export default createStore(reducer,applyMiddleware(thunk))