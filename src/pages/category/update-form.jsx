import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form,Input} from 'antd'

const Item = Form.Item
//更新分类的form组件
export default class UpdateForm extends Component{

    static propTypes={
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }
    formRef = React.createRef()


    UNSAFE_componentWillMount = ()=>{
        this.props.setForm(this.formRef)
    }

    // props里的是更新前的
    UNSAFE_componentWillUpdate = (nextProps)=>{
        const {categoryName} = nextProps
        //setFieldsValue会重新调用render，这个修改Formd initialValues
        //当Form.Item设置了name，Item的initialValue失效，由Form的initialValues来控制
        //自己想想，一开始的显示和后来的隐藏有什么不同
        //一开始显示的时候未更新的props与nextProps明显不同，如果相同更不需要更新
        //当我隐藏的时候，props是目前行的信息（未更新），隐藏时传入的也是目前行的信息，即nextProps与props相同
        //如果不写这个if，隐藏的时候会再次把initialValue更新成categoryName，虽然对数据处理无影响,就很突兀
        if(this.props.categoryName!=nextProps.categoryName)
            {
                this.formRef.current.setFieldsValue({
                    categoryName:categoryName,
            });
            
        }
    };
    //用DidUpdate也一样，就很奇怪，setFiledsValue是没调用render的，可能Form里的initialValues指向的那个地址的值被改了，也就体现在页面了
    //原理好像叫表单回显
    
    // static timer = 0;
     render(){
        const {categoryName} = this.props
        // console.log(UpdateForm.timer++);
        // console.log(this.formRef.current)
        return (
           <Form ref={this.formRef}
           initialValues={{category:categoryName}}
           
           > 
                <Item
                name='categoryName'
                rules={[
                    {
                        required:true,
                        message:'分类名称必须输入'
                    }
                ]}
                >
                    <Input placeholder='请输入分类名称' />
                </Item>
           </Form>
        )
    }
}