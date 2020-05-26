import React, {Component} from 'react'
import {Card,Table,Button, message,Modal} from 'antd'
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddCategory,reqUpdateCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component{

    state = {
        categorys:[],//一级分类列表
        subCategorys:[],
        loading:false,
        parentId:'0',//当前需要显示的分类列表的parentId
        parentName:'',//当前需要显示的分类列表的parentName
        showStatus:0,//标识添加/更新的确认框是否显示,0都不显示,1：显示添加,2:显示更新
    }


    //初始化Table所有列的数组
    initColumns = ()=>{
        this.columns = [
            {
              title: '分类的名称',
              dataIndex: 'name',//显示对应数据名
            },
            {
              title: '操作',
              width:300,
              //传的是对象那行的数据对象
              render: (category)=>( //返回需要显示的标签
                  <span>
                      <LinkButton onClick={()=> this.showUpdate(category)}>修改分类</LinkButton>
                      {this.state.parentId==='0'?<LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton>:null}
                      {/* 想传参给回调函数就得写成这样 */}
                  </span>
              )
            }
          ];
    }
    //显示一级列表
    showCategorys = ()=>{
        this.setState({
            subCategorys:[],
            parentId:'0',
            parentName:'',
        })
    }
    //显示指定一级分类对象的二级列表
    showSubCategorys = (category) => {
        //先更新状态，才能发请求
        // this.setState({
        //     parentId:category._id,
        //     parentName:category.name
        // })
        // //你会发现这还是0,因为setState是异步的，所以这么写没用
        // console.log(this.state.parentId)
        // this.getCategorys()
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{
            this.getCategorys()
        })//这个回调函数会在状态更新后并且render被调用后被执行
    }
    //异步获得一级/二级列表显示
    getCategorys = async()=>{
        //在发请求前显示loading
        this.setState({loading:true})
        const {parentId} = this.state
        const result = await reqCategorys(parentId)
        //这就是await的好处了，写起来跟同步一样，其实是异步的。
        //只有得到了result才会进行下面的，如果是一般的异步就直接去进行下面代码了
        //请求完数据了就隐藏loading
        this.setState({loading:false})

        if(result.status===0){
            //取出分类数组
            const categorys = result.data
            if(parentId==='0')
            {
                this.setState({categorys})
            }
            else{
                this.setState({subCategorys:categorys})
            }
        }
        else{
            message.error('获取分类列表失败')
        }
    }


    handleCancel = ()=>{
        this.setState({showStatus:0})
    }


    showAdd = ()=>{
        this.setState({showStatus:1})
    }
    //添加分类
    addCategory =  ()=>{
        //antd v4版本的validateFields被改成promise了，表单不通过验证就进入catch
        this.form_add.current.validateFields().then(async (values)=>{
            console.log("Add")
            //隐藏框
            this.setState({showStatus:0})
            //收集数据，并提交添加分类的请求
            const {parentId,categoryName} = values
            //重新获取分类列表显示
            const result = await reqAddCategory(categoryName,parentId)
            if(result.status===0&&parentId===this.state.parentId)
            {
                //当添加在当前页面中时，渲染新的列表（添加在儿子里的话渲染也不会变，没必要）
                this.getCategorys()
            }
        })
        .catch(error=>{message.error('请输入值')})
     
    }

    showUpdate = (category)=>{
        this.category = category
        this.setState({showStatus:2})
    }
    //更新分类
    updateCategory =  ()=>{
        console.log("Update")
        //进行表单验证，通过了才处理,没通过连表单都关不掉
        this.form_update.current.validateFields().
        then(async (values)=>{
               //1.隐藏确定框
               this.setState({showStatus:0})
               const categoryId = this.category._id
               // console.log(this.form)
               // const categoryName = this.form_update.current.getFieldValue('category')
               const {categoryName} = values
               //2.发请求更新分类
               const result = await reqUpdateCategory({categoryId,categoryName})

               if(result.status===0){
                   //3.重新显示列表,因为后台更新了，前台render的没变
               this.getCategorys()
        }
    }).catch(err=>{message.error('请输入')})
        


      
      
    }

    //发异步ajax请求
    //获取一级列表显示
    componentDidMount(){
        this.getCategorys()
    }

    //同步的写在Will,为第一次render准备数据
    UNSAFE_componentWillMount (){
        this.initColumns()
    }

     render(){
        const {parentId,categorys,loading,subCategorys,parentName,showStatus} = this.state

         //左侧的
         const title = parentId==='0'?'一级分类列表':(<span>
             <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
             <ArrowRightOutlined style={{marginRight:5}} />
            <span>{parentName}</span>
         </span>)
         //右侧的
         const extra = (
         <Button icon={<PlusOutlined />} type='primary'  onClick={this.showAdd} >
             添加
         </Button>
         )
         //如果还没有，指定空对象,不然一直提示undefined error 太烦了
           const category = this.category || {name:''}
          //标签里直接写个bordeasred  ===  bordered={true}
        return (
            <Card title={title} extra={extra} >
                <Table dataSource={parentId==='0'?categorys:subCategorys} columns={this.columns} bordered rowKey='_id' pagination={{defaultPageSize:5,showQuickJumper:true}} loading={loading} />

                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categorys={parentId==='0'?categorys:subCategorys} 
                    parentId={parentId}
                    parentName={parentName}
                    setForm={(form)=>{this.form_add = form}}
                    />
                </Modal>

                {/* 
                visible=flase他是不会去渲染的,只会预编译一下,即UpdateForm不会被调用
                当我们第一次点击修改分类，UpdateForm第一次被调用，此时是不会用他的DidUpdate，因为是第一次render
                当我们点确定什么的按钮的时候，因为要把该组件隐藏，所以会重新调用他的render，这次触发了DidUpdate
                注意这里只触发了一次DidUpdate
                以后我们点击修改分类，都不是第一次了，所以一点击，render结束就会触发DidUpdate
                点任意按钮，隐藏又会触发DidUpdate
                这些会触发2次

                */}
                <Modal
                    title="风险分类"
                    visible={showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                   <UpdateForm categoryName={category.name} 
                   setForm={(form)=>{this.form_update = form}
                //    尚硅谷老师把两个setForm都修改this.form,并且都用WillMount
                //很明显，这两个都只会调用一次，只要点击一次修改名称，再点击一次添加分类，再点击修改名称，这时候的form是指向添加分类的
                //也就是bug了
                } 
                   />
                </Modal>
            </Card>
        )
    }
}