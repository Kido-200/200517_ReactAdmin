//应用的根组件

import React, {Component} from 'react'
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom'


import Admin from './pages/admin/admin'
import Login from './pages/login/login'


export default class App extends Component{
  
     render(){
        return (
            <BrowserRouter>
            {/* 不加Switch的话，Admin也会显示出来 */}
            <Switch>
                <Route path='/login' component={Login}></Route>
                <Route path='/' component={Admin}></Route>
                <Redirect to='/login' />
            </Switch>
            </BrowserRouter>
        )
    }
}