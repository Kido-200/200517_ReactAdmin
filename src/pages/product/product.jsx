import React, {Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductDetail from './detail'
import ProductAddUpdate from './add-update'

export default class Product extends Component{
     render(){
        return (
          <Switch>
              {/* exact是bool值，true表示路径完全匹配才触发 */}
              <Route exact path='/product' component={ProductHome}></Route>
              <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
              <Route path='/product/detail' component={ProductDetail}></Route>

            
              <Redirect to='/product'></Redirect>
                {/*
              <Route path='/product' component={ProductHome}></Route>
             别忘了switch是一个个下来的，所以/product必须放最后，不然一直都是匹配这个了 
             */}
          </Switch>
        )
    }
}