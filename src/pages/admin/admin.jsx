import React, {Component} from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import {Layout} from 'antd'
import {connect} from 'react-redux'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found'



const {Footer,Sider,Content} = Layout

class Admin extends Component{
     render(){
         const user = this.props.user

         //如果内存中没有存储user==>还没登陆
         if(!user||!user._id){
            //自动跳转到登陆
            return <Redirect to='/login' />
         }
        return (
            <Layout style={{minHeight:'100%'}}>
            <Sider>
                <LeftNav/>
            </Sider>
            <Layout>
              <Header>Header</Header>
              <Content style={{margin:20,backgroundColor:'#fff'}}>
                <Switch>
                  {/* 访问/ 会直接到home，访问其他不对应的会到NotFound */}
                  <Redirect  exact={true} from='/' to='/home' />
                  <Route path='/home' component={Home}></Route>
                  <Route path='/category' component={Category}></Route>
                  <Route path='/product' component={Product}></Route>
                  <Route path='/role' component={Role}></Route>
                  <Route path='/user' component={User}></Route>
                  <Route path='/charts/bar' component={Bar}></Route>
                  <Route path='/charts/line' component={Line}></Route>
                  <Route path='/charts/pie' component={Pie}></Route>
                  {/* 上面没一个匹配的直接显示 */}
                  <Route component={NotFound} />
                </Switch>
              </Content>
              <Footer style={{textAlign:'center',color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳的页面操作体验</Footer>
            </Layout>
          </Layout>
        )
    }
}
export default connect(
  state=>({user:state.user}),
  {}
)(Admin)