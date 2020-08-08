// import {createStore,applyMiddleware} from 'redux'
import {createStore} from '../lib/redux'

// import thunk from 'redux-thunk'//用来实现redux异步的redux中间件
// import {composeWithDevTools} from 'redux-devtools-extension'

import reducer from './reducer'

// export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))
export default createStore(reducer)