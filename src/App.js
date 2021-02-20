//应用的根组件

import React, {Component} from 'react'
import {HashRouter,Route,Switch} from 'react-router-dom'


import Admin from './pages/admin/admin'
import Login from './pages/login/login'


export default class App extends Component{
  
     render(){
        return (
            <HashRouter>
            {/* 不加Switch的话，Admin也会显示出来 */}
            <Switch>
                <Route path='/login' component={Login}></Route>
                <Route path='/' component={Admin}></Route>
                {/* 一开始去路径path='/'，然后Admin校验是否已经登陆，未登陆就Rirect到login。 */}
            </Switch>
            </HashRouter>
        )
    }
}