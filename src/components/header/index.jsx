import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import LinkButton from '../link-button'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.css'
import {reqWeather} from '../../api/index'
import menuList from '../../config/menuConfig'

class Header extends Component{
    state = {
        currentTime:formateDate(Date.now()),//当前时间的字符串
        dayPictureUrl:'',//天气图片url、
        weather:'',//天气的文本
    }

    getTime = ()=>{
        //每隔一秒去获得当前时间并更新状态数据cuurentTime
        this.intervalId = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async ()=>{
        //调用接口请求异步获取数据
         const {dayPictureUrl,weather} = await reqWeather('北京')
         console.log(dayPictureUrl,weather)
        //更新状态
        this.setState({dayPictureUrl,weather})
    }

    getTitle = ()=>{
        const path = this.props.location.pathname
        let title = ''
        menuList.forEach(item=>{
            if(item.key===path){
                title = item.title
            }
            else if(item.children){
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if(cItem){
                    title=cItem.title
                }
            }
        })
        return title
    }

    logout = ()=>{
        //显示确认框
        Modal.confirm({
            // title: '退出',
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗?',
            onOk:()=>{
            //   console.log('OK');
            //删除保存的user数据
            memoryUtils.user={}
            storageUtils.removeUser()
            //跳转刀login
            this.props.history.replace('/login')
            },
            onCancel() {
              console.log('Cancel');
            },
          });

    }
    //获取时间和天气是异步操作，都要放在DidMount
    componentDidMount(){
       this.getTime()
       this.getWeather()
    }
    //当前组件卸载前调用
    componentWillUnmount(){
        //清除计时器
        clearInterval(this.intervalId)
    }
     render(){
        const {currentTime,dayPictureUrl,weather} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default  withRouter(Header)