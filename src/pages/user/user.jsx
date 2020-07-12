import React, {Component} from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'

import {formateDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import {reqUser,reqAddOrUpdateUser, reqDeleteUser} from '../../api/index'
import UserForm from './user-form'

export default class User extends Component{

    state = {
        users:[],//所有的用户列表
        roles:[],//所有角色的列表
        isShow:false,//是否显示确认框
    }

    //发生添加或修改请求
    addOrUpdateUser = async () =>{
        //收集输入数据
        const user = this.form.current.getFieldsValue()
        //提交添加请求
        this.form.current.resetFields()
        if(this.user){
            user._id=this.user._id
        }
        const result = await reqAddOrUpdateUser(user)
        //更新列表显示
        if(result.status===0)
        {
            message.success(`${this.user?'修改':'添加'}用户成功`)
            this.getUsers()
        }
        else
        {
            message.error(`${this.user?'修改':'添加'}用户失败`)
        }
        this.setState({isShow:false})

    }

      //显示添加界面
    showAdd = ()=>{
        this.user = null
        // this.form.current.setFieldsValue(this.user)
        // console.log(this.form)
        this.setState({isShow:true})
    }

    //显示修改界面
    showUpdate = (user)=>{
        this.user = user//保存user
        // this.form.current.setFieldsValue(this.user)
        // console.log(this.form)
        this.setState({isShow:true})
        
    }

    deleteUser = (user)=>{
        Modal.confirm({
            title: `确认删除${user.username}吗`,
            okText: '确认',
            cancelText: '取消',
            onOk: async ()=>{
                const result = await reqDeleteUser(user._id)
                if(result.status===0){
                    message.success('删除用户成功!')
                    this.getUsers()
                }
                else{
                    message.error('删除用户失败')
                }
            }

          });
    }
  

    initColumns = ()=>{
        this.columns = [
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone',
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render: formateDate
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render: (role_id) => this.roleNames[role_id]
               
            },
            {
                title:'操作',
                render: (user) => (
                <span>
                    <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                    <LinkButton onClick={()=>{this.deleteUser(user)}}>删除</LinkButton>
                </span>)
            },
        ]
    }

    getUsers = async () =>{
        const result = await reqUser()
        if(result.status===0)
        {
            const {users,roles} = result.data
            this.initRoleNames(roles)
            this.setState({users,roles})
        }
        else{
            console.log('请求失败')
        }
    }


    //根据role的数组，生成包含所有角色id到角色名的映射
    initRoleNames = (roles) =>{
        const roleNames = roles.reduce((pre,role)=>{
            pre[role._id] = role.name
            return pre
        },{})
        this.roleNames = roleNames
    }

    componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getUsers()
    }

     render(){

        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        const {users,isShow,roles} = this.state
        const user = this.user
        return (
           <Card title={title}>
                <Table 
                dataSource={users} 
                columns={this.columns} 
                bordered 
                rowKey='_id' 
                pagination={{defaultPageSize:5,showQuickJumper:true}} 
                />


                <Modal
                    title={user ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.current.resetFields()
                        this.setState({isShow:false})
                    }
                }
                >
                    <UserForm 
                    setForm = {form=> this.form=form}
                    roles={roles}
                    user={user}
                    />
                </Modal>
           </Card>
        )
    }
}