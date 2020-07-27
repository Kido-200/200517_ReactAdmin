import React, {Component} from 'react'
import { Form, Input, Button,message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Redirect} from 'react-router-dom'


import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api/index.js'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'


const Item = Form.Item//不能写在import之前


const Demo = (history)=>{
    const [form] = Form.useForm();//需要去与Form标签关联
    // const handleSubmit = (event)=>{
    //     const values = form.getFieldValue()//返回一个对象
    //     console.log(values);//是下面设置了name的Form.Item里input的输入值
    // }
    const validatePwd = (rule,value)=>{
        if(!value)
        {
            return Promise.reject('需要输入');
        }
        else if(value.length<4){
            return Promise.reject('密码长度不得小于4位');
        }
        else if(value.length>12){
            return Promise.reject('密码长度不得大于12位');
        }
        else if(!/^[a-zA-Z0-9_]+$/.test(value))
        {
            return Promise.reject('用户名必须是英文，数字或下划线组成');
        }
        else
        {
            return Promise.resolve();
        }
    }
    const onFinish = (values)=>{
        console.log('校验成功',values);
        //请求登陆
        const {username,password} = values;
        console.log(username,password)
        reqLogin(username,password).then(response =>{
            console.log('请求成功了')
            if(response.status==0)
            {
                message.success('登陆成功')
                //跳转到后台管理界面
                console.log(response.data)
                const user = response.data
                memoryUtils.user = user
                storageUtils.saveUser(user)//保存到local中
                history.history.replace('/');
            }
            else{
                message.error(response.msg)
            }
        }).catch(error=>{
            console.log('请求失败了',error)
        })
    }
    const onFinishFailed = (values, errorFields, outOfDate)=>{//
        console.log('校验失败',values, errorFields, outOfDate);
    }
    return (
        // 这个form={form}是把上面那个form和这个Form标签关联起来的，不能删掉
        <Form  form={form}
                        className="login-form"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Item
                            name="username"
                            initialValue="admin"
                            rules={[
                            {
                                required: true,
                                message: '用户名必须输入!',
                                whitespace:true//如果字段仅包含空格则校验不通过
                            },
                            {
                                min:4,message:'用户名至少四位'
                            },
                            {
                                max:12,message:'用户名最多12位'
                            },
                            {
                                pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文，数字或下划线组成'
                            }
                            
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Item>
                        <Form.Item
                            name="password"
                            rules={[
                            // {
                            //     required: true,
                            //     message: '请输入密码!',
                            // },
                            {
                                validator:validatePwd
                            }
                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登陆
                            </Button>
                        </Form.Item>
    </Form>
    )
}

// class Demo extends Component
// {
//     form = React.createRef();//需要去与Form标签关联
//     // const handleSubmit = (event)=>{
//     //     const values = form.getFieldValue()//返回一个对象
//     //     console.log(values);//是下面设置了name的Form.Item里input的输入值
//     // }
//     validatePwd = (rule,value)=>{
//         if(!value)
//         {
//             return Promise.reject('需要输入');
//         }
//         else if(value.length<4){
//             return Promise.reject('密码长度不得小于4位');
//         }
//         else if(value.length>12){
//             return Promise.reject('密码长度不得大于12位');
//         }
//         else if(!/^[a-zA-Z0-9_]+$/.test(value))
//         {
//             return Promise.reject('用户名必须是英文，数字或下划线组成');
//         }
//         else
//         {
//             return Promise.resolve();
//         }
//     }
//     onFinish = async (values)=>{
//         console.log('校验成功',values);
//         //请求登陆
//         const {username,password} = values;
//         console.log(username,password)
//         reqLogin(username,password).then(response =>{
//             console.log('请求成功了')
//             if(response.status==0)
//             {
//                 message.success('登陆成功')
//                 // 跳转到后台管理界面
//                 // createBrowserHistory().replace('/');
//                 //创造一个history，来进行页面跳转，因为我们这个是函数，而不是类
//                 //是类的话，并且外层有Router就会有this.props.history
//                 console.log(this.props.history)
//                this.props.history.replace('/')
//             }
//             else{
//                 message.error(response.msg)
//             }
//         }).catch(error=>{
//             console.log('请求失败了',error)
//         })
//     }
//     onFinishFailed = (values, errorFields, outOfDate)=>{//
//         console.log('校验失败',values, errorFields, outOfDate);
//     }
//     render(){
//         return (
//         // 这个form={form}是把上面那个form和这个Form标签关联起来的，不能删掉
//         <Form  ref={this.form} 
//                         className="login-form"
//                         onFinish={this.onFinish}
//                         onFinishFailed={this.onFinishFailed}
//                     >
//                         <Item
//                             name="username"
//                             initialValue="admin"
//                             rules={[
//                             {
//                                 required: true,
//                                 message: '用户名必须输入!',
//                                 whitespace:true//如果字段仅包含空格则校验不通过
//                             },
//                             {
//                                 min:4,message:'用户名至少四位'
//                             },
//                             {
//                                 max:12,message:'用户名最多12位'
//                             },
//                             {
//                                 pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文，数字或下划线组成'
//                             }
                            
//                             ]}
//                         >
//                             <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
//                         </Item>
//                         <Form.Item
//                             name="password"
//                             rules={[
//                             // {
//                             //     required: true,
//                             //     message: '请输入密码!',
//                             // },
//                             {
//                                 validator:this.validatePwd
//                             }
//                             ]}
//                         >
//                             <Input
//                             prefix={<LockOutlined className="site-form-item-icon" />}
//                             type="password"
//                             placeholder="密码"
//                             />
//                         </Form.Item>
//                         <Form.Item>
//                             <Button type="primary" htmlType="submit" className="login-form-button">
//                             登陆
//                             </Button>
//                         </Form.Item>
//     </Form>
//     )
//                         }
// }
// 登陆的路由组件
export default  class Login extends Component{
    
    

     render(){
         //如果用户已经登陆，自动跳转到管理页面,就阻止了用户自己改url跳过去
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to='/' />
        }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登陆</h2>
                    <Demo history={this.props.history}/>
                </section>
            </div>
        )
    }
}
/*
1.前台表单认证
2.收集表单数据
*/
