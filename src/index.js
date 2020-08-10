import React from 'react'
import ReactDom from 'react-dom'
import {Provider} from 'react-redux'

//import 'antd/dist/antd.css'

import App from './App'
import store from './redux/store'

//读取local中保存user，保存到内存中

ReactDom.render(
<Provider store={store}>
<App />
</Provider>
,document.getElementById("root"))
