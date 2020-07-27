import React, {PureComponent} from 'react'
import {Form,Input,Tree} from 'antd'
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig'
const Item = Form.Item

//添加分类的form组件
export default class AuthForm extends PureComponent{
    // formRef = React.createRef()
    static propTypes = {
        role:PropTypes.object
    }

    constructor(props){
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys:menus
        }

    }

    getTreeNodes = (menuList) =>{
        return menuList.reduce((pre,item) => {
            const title = item.title
            const key = item.key
            let children
            if(item.children)
            {
                children = this.getTreeNodes(item.children)
            }
            else{
                children = null
            }
            pre.push(
                {
                    title,
                    key,
                    children
                }   )
            return pre
        },[])
       
    }

    //选中某个node时的回调
    onCheck = checkedKeys => {
        this.setState({checkedKeys})
    }

    //为父组件提交获取最新数据的方法
    getMenus = () => this.state.checkedKeys

    UNSAFE_componentWillMount(){
        this.treeData=[
            {
                title:'平台权限',
                key:'all'
            }
        ]
        this.treeData[0].children = this.getTreeNodes(menuList)
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.setState({checkedKeys:menus})
    }


     render(){
         const {role} = this.props
         const {checkedKeys} = this.state
         const formItemLayout = {
             labelCol:{span:4},
             wrapperCol:{span:15}
         }          

        return (
           <Form 
        //    ref={this.formRef}
        //    initialValues={{parentId:parentId}}
           >
                <Item
                label='角色名称' {...formItemLayout}
                //  name='roleName'  Item设置为name，Input的value会受Form控制，而不是Input的value
                 rules={[{
                     required:true,
                     message:'必须输入角色名称'
                 }]}
                >
                    <Input value={role.name} disabled/>
                </Item>

                <Tree
                defaultExpandAll
                checkable
                treeData={this.treeData}
                checkedKeys={checkedKeys}
                // checkedKeys={['/user','/role']}
                //因为key值跟menus里的一样，所以会自动去找一样的选中
                onCheck={this.onCheck}
                />
           </Form>
        )
    }
}