import React, {Component} from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option
//添加分类的form组件
export default class UserForm extends Component{
    formRef = React.createRef()
    static propTypes = {
        setForm:PropTypes.func.isRequired,//用来传递form对象的函数
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
      
    }

    //只需要设置一次就行了
    UNSAFE_componentWillMount(){
        this.props.setForm(this.formRef)
        // console.log('will',this.formRef)
    }
    UNSAFE_componentWillUpdate(nextProps){
        console.log(this.props)
        let user = {}
        if(nextProps.user)//下一个是有属性值的，直接相等
        {
            user = nextProps.user
        }
        else if(this.props.user)//如果是一开始有现在没了，我把对应user的属性值全部设置为0
        {
            for(let key in this.props.user)
            {
                user[key] = undefined
                //不能设置为 '' 这种，这还是代表有字符串，会让Select无法匹配，导致Select的PlaceHolder失效
            }
        }
        //上次也没有，这次也没有值，直接设置为{}，表示没有对initialValue进行修改
        this.formRef.current.setFieldsValue(user)
        //这个的用法是把xxx设置为xxx，所以直接设置为{}，表示没有对initialValue进行修改
    }


     render(){
        //  console.log('user in FORM',this.props.user)
         const {roles} = this.props
         const user = this.props.user || {}
        //  if(this.formRef.current)
        // {
        //   this.formRef.current.setFieldsValue(user)
        // }
         const formItemLayout = {
             labelCol:{span:4},
             wrapperCol:{span:15}
         }
         //显示不正常应该是initialValues的问题,只会在第一次Mount被调用·
        return (
           <Form ref={this.formRef}
             initialValues={user}
             {...formItemLayout}
           >
                <Item
                label='用户名'
                name='username'
                rules={[{
                     required:true,
                     message:'必须输入用户名'
                 }]}
                >
                    <Input placeholder='请输入角色名称'/>
                </Item>


                 {
                     //不让他修改密码
                     user._id ? null :(
                        <Item
                        label='密码'
                        name='password'
                        rules={[{
                             required:true,
                             message:'必须输入密码'
                         }]}
                        >
                            <Input type='password' placeholder='请输入密码'/>
                        </Item>
                     )
                 }
               

                <Item
                label='手机号码'
                name='phone'
                rules={[{
                     required:true,
                     message:'必须输入手机号码'
                 }]}
                >
                    <Input placeholder='请输入手机号码'/>
                </Item>

                <Item
                label='邮箱'
                name='email'
                rules={[{
                     required:true,
                     message:'必须输入邮箱'
                 }]}
                >
                    <Input placeholder='请输入邮箱'/>
                </Item>

                <Item
                label='角色'
                name='role_id'
                rules={[{
                     required:true,
                     message:'必须输入邮箱'
                 }]}
                >
                    <Select
                    placeholder="请选择角色"
                    >
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
           </Form>
        )
    }
}