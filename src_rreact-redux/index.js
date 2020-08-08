import React from 'react'
import ReactDom from 'react-dom'
import App from './containers/App'
// import {Provider} from 'react-redux'
import {Provider} from './lib/react-redux'
import store from './redux/store'

ReactDom.render(
<Provider store={store}>
    <App />
</Provider>,document.getElementById("root"))
