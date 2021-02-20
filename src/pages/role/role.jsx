import React, {Component} from 'react'
import {Card,Table,Button,Modal, message} from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import {connect} from 'react-redux'

import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import {formateDate} from '../../utils/dateUtils'
import {logout} from '../../redux/actions'


class Role extends Component{

    state = {
        roles:[],//所有的roles
        role:{},//选中的role
        isShowAdd:false,//是否显示添加界面
        isShowAuth:false
    }

    constructor (...props){
        super(...props)
        this.auth = React.createRef()
    }

    getRoles = async() =>{
        const result = await reqRoles()
        if(result.status===0)
        {
            const roles = result.data
            this.setState({roles})
        }
        else{
            console.log(result)

        }
    }

    initColumn = ()=>{
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name',
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render : (create_time) => formateDate(create_time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render: formateDate
                //会自动传入dataIndex，这就满足了
            },
            {
                title:'授权人',
                dataIndex:'auth_name',
            },
        ]
    }

    onRow = (role) => {
        return {
            onClick : event =>{
                console.log('row onClick()',role)
                console.log(this.props);
                this.setState({role})
            }
        }
    }

    addRole = () =>{
        //表单验证
        this.form.current.validateFields().then(async values =>{
            this.setState({isShowAdd:false})
            const roleName = values.roleName
            //this.form.resetFileds()
            //收集输入数据
            const result = await reqAddRole(roleName)
            if(result.status===0)
            {
                message.success('添加角色成功')
                //发送请求获取
                //this.getRoles()
                const role = result.data                   
                // const roles = this.state.roles
                //产生新的数组，上面这种方法取的应该是地址，直接修改state是不推荐的
                //下面这种好一些
                // const roles = [...this.state.roles]
                // roles.push(role)
                // this.setState({roles})
                //最推荐的是用函数，返回一个对象
                this.setState(state => ({
                        roles:[...state.roles,role]
                    }))
            }
            else{
                message.error('添加角色失败')
                console.log(result)

            }
        }).catch(error=>{console.log(error)})

        
    }

    
    //更新角色
    updateRole = async () => {
        this.setState({isShowAuth:false})
        const role = this.state.role
        //得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        // console.log('atttt',this.props.user)
        role.auth_name = this.props.user.username
        role.auth_time = Date.now()
        console.log(role.auth_time)
        const result = await reqUpdateRole(role)
        //这个请求，传menus这个属性的时候出了问题，他把整个数组所有值并成一个字符串发过去了
        //发完这个请求，role里的menus变成['']只有一串字符串了,而不是分成很多元素
        if(result.status===0)
        {
            // this.getRoles()
            if(role._id === this.props.user.role_id){
                this.props.logout()
                message.success('当前用户角色权限修改了，请重新登陆')

            }else{
                message.success('设置角色权限成功')
                this.setState({
                    roles:[...this.state.roles]
                })
            }
            
        }
    }

    componentWillMount () {
        this.initColumn()
    }

    componentDidMount(){
        this.getRoles()
    }

     render(){

        const {roles,role,isShowAdd,isShowAuth} = this.state

        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd:true})}>创建角色</Button> &nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth:true})} >设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table 
                rowSelection={{
                    type:'radio',
                    selectedRowKeys:[role._id],
                onSelect:(role) => {
                    this.setState({role})
                }
                }}
                bordered
                rowKey='_id'
                dataSource={roles}
                columns={this.columns}
                pagination={{defaultPageSize:PAGE_SIZE}}
                onRow={this.onRow}
                />

            <Modal
            title="添加角色"
            visible={isShowAdd}
            onOk={this.addRole}
            onCancel={() => {
                this.setState({isShowAdd:false})
                this.form.current.resetFields()
        }}
            >
              <AddForm
                setForm={(form)=>{this.form = form}}
              ></AddForm>
            </Modal>

            <Modal
            title="设置角色权限"
            visible={isShowAuth}
            onOk={this.updateRole}
            onCancel={() => {
                this.setState({isShowAuth:false})
        }}
            >
              <AuthForm
              role = {role}
              ref = {this.auth}
              ></AuthForm>
            </Modal>


            </Card>
        )
    }
}

export default connect(
    state=>({user:state.user}),
    {logout}
)(Role)