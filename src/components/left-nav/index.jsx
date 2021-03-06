import React, {Component} from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu } from 'antd';
import {connect} from 'react-redux'



import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig'
import {setHeadTitle} from '../../redux/actions'

const SubMenu = Menu.SubMenu

class LeftNav extends Component{


    //判断当前登陆用户对该item是否有权限
    hasAuth = (item) =>{
        const {key,isPublic} = item
        const menus = this.props.user.role.menus
        const username = this.props.user.username

        //1. 如果当前用户是admin，直接通过
        //2. 如果当前item是公开的
        //3. 当前用户有此item的权限:key是否在menus中
        if(username==='admin'|| isPublic ||menus.indexOf(key)!=-1)
        {
            return true
        }
        //4. 如果当前用户有此item的某个子item的权限
        else if(item.children){
            return !!item.children.find(child => menus.indexOf(child.key)!==-1)
        }
        return false
    }

    //根据menu的数据数组，生成对应的标签数组，这里会自动解析
    //使用map+递归实现
    getMenuNodes_map = (menuList)=>{
        return menuList.map((item)=>{
            /*
            {title:'首页'，
            key:'/home',
            icon:'home',
            children:[]//可能有可能没
        }
            */
           if(!item.children){
               return (
                <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.key}>
                <span>{item.title}</span>
                </Link>
            </Menu.Item>
               )
            
           }
           else{
               return (
                <SubMenu key={item.key} icon={item.icon} title={item.title}>
                {this.getMenuNodes_map(item.children)}
            </SubMenu> 
               )
           }
        })
    }

    //使用reduce()+递归也可以实现
    //pre是上次return的结果

    // <Menu.Item key="/home" >
    //                 <Link to='/home'>
    //                 <span>首页</span>
    //                 </Link>
    //             </Menu.Item>
    getMenuNodes = (menuList)=>{
        const path = this.props.location.pathname
        return menuList.reduce((pre,item)=>{

            //如果当前用户有item对应的权限，才需要显示对应的菜单项
            if(this.hasAuth(item))
            {
                 //向pre添加<Menu.Item>
            if(!item.children){
                //判断item是否是当前item
                if(item.key===path || path.indexOf(item.key)===0)
                {
                    this.props.setHeadTitle(item.title)

                }

                pre.push((
                    <Menu.Item key={item.key} >
                    <Link to={item.key} onClick={()=>this.props.setHeadTitle(item.title)}>
                        {item.icon}
                    <span>{item.title}</span>
                    </Link>
                </Menu.Item>
                // icon={item.icon}
                //   <Menu.Item key="/home" >
                //     <Link to='/home'>
                //     <span>首页</span>
                //     </Link>
                // </Menu.Item>
                ))
            }
            //向pre添加SubMenu
            else{
                //看他的儿子里有没有人的key===url路径里的key
                const cItem = item.children.find(cItem=> path.indexOf(cItem.key)===0)
                //如果存在，说明当前item(submenu)的子列表需要展开
                if(cItem)
                {
                    this.openKey = item.key
                }
                pre.push((
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                {this.getMenuNodes(item.children)}
            </SubMenu> 
                ))
            }
            }
           
            return pre
        },[])
    }
    
    //在第一次render之前执行一次
    //为第一次render渲染做准备数据(同步的)
    UNSAFE_componentWillMount (){
         //这个必须提前执行，因为defaultOpenKeys得从这里获得
         this.menuNodes = this.getMenuNodes(menuList)
        //写在render里又会效率低下，每次重新渲染
    }

     render(){
         
        let path = this.props.location.pathname
        if(path.indexOf('/product')===0)
        {
            //说明是请求的product或下面的子路由
            //改成这个，来使得下面的selectedKeys正确
            path = '/product'
        }
        return (
                 <div  className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>后台管理</h1>
                </Link> 
                    
                <Menu
                //defaultSelectedKeys,默认选中的key值,这个只能改一次，以后再改是不起作用的
                //所以直接3000/ 会先把他设置为 / 后面再设置为/home,已经不会设置他了
                selectedKeys={[path]}   
                defaultOpenKeys={[this.openKey]}
                mode="inline"
                theme="dark"
                >
                    
                {/* <Menu.Item key="/home" >
                    <Link to='/home'>
                    <span>首页</span>
                    </Link>
                </Menu.Item>
               
                <SubMenu key="sub1"  title="商品">
                    <Menu.Item key="/category" >
                        <Link to='/category'>
                    <span>品类管理</span>
                    </Link>
                    </Menu.Item>
                    <Menu.Item key="/product" >
                    <Link to='/product'>
                    <span>商品管理</span>
                    </Link>
                    </Menu.Item>
                </SubMenu>  */}

            {
                this.menuNodes
            }
        </Menu>

                </div>

                        
        )
    }
}
//withRouter高阶组件：让非路由组件也拥有Route的三个属性
//包装非路由组件，返回一个新的组件
//新的组件向非路由组件传递3个属性：history/location/match 就是Route那三个
export default connect(
    state =>({user:state.user}),
    {setHeadTitle}
)(withRouter(LeftNav))
//这样就可以实现就算刷新，选中的那一栏依旧是被选中。