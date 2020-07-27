import React, {Component} from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option
//添加分类的form组件
export default class AddForm extends Component{
    formRef = React.createRef()
    static propTypes = {
        setForm:PropTypes.func.isRequired,//用来传递form对象的函数
        categorys:PropTypes.array.isRequired,//一级分类的数组
        parentId:PropTypes.string.isRequired,//父分类的ID
        parentName:PropTypes.string.isRequired
    }

    //只需要设置一次就行了
    UNSAFE_componentWillMount(){
        this.props.setForm(this.formRef)
    }

    //每次点击添加都要重新改变Form的initialValues
    //第一次点击initialValues是正确的，所以设置Update就行了
    UNSAFE_componentWillUpdate(nextProps){
        const {parentId} = nextProps
        //这里把categoryName改成''就不用在添加完调用form.current.resetFieldsValue了,不然这个Input里面的值还是我们上次输入过的值，被保存下来了
        this.formRef.current.setFieldsValue({parentId:parentId,categoryName:''})
    }

     render(){
        const {categorys,parentId,parentName} = this.props
        // console.log(categorys)
        return (
           <Form ref={this.formRef}
           initialValues={{parentId:parentId}}
           >
               <Item
                 name='parentId'
                 >
                    <Select >
                        <Option value={parentId} >{parentId==='0'?'一级分类列表':parentName}</Option>
                        {
                            categorys.map( (c,index) => <Option value={c._id} key={index+1}>{c.name}</Option> )
                        }
                    </Select>
               </Item>
                <Item
                 name='categoryName'
                 rules={[{
                     required:true,
                     message:'必须输入分类名称'
                 }]}
                >
                    <Input placeholder='请输入分类名称'/>
                </Item>
           </Form>
        )
    }
}