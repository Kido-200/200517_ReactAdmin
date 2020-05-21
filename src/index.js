import React from 'react'
import ReactDom from 'react-dom'
//import 'antd/dist/antd.css'

import App from './App'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'


//读取local中保存user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

ReactDom.render(<App />,document.getElementById("root"))