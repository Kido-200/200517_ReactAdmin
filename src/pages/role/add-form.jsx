import React, {Component} from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
//添加分类的form组件
export default class AddForm extends Component{
    formRef = React.createRef()
    static propTypes = {
        setForm:PropTypes.func.isRequired,//用来传递form对象的函数
      
    }

    //只需要设置一次就行了
    UNSAFE_componentWillMount(){
        this.props.setForm(this.formRef)
    }


     render(){
         const formItemLayout = {
             labelCol:{span:4},
             wrapperCol:{span:15}
         }
        return (
           <Form ref={this.formRef}
        //    initialValues={{parentId:parentId}}
           >
                <Item
                label='角色名称' {...formItemLayout}
                 name='roleName'
                 rules={[{
                     required:true,
                     message:'必须输入角色名称'
                 }]}
                >
                    <Input placeholder='请输入角色名称'/>
                </Item>
           </Form>
        )
    }
}