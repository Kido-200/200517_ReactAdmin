import React, {Component} from 'react'
import {Card,Table,Button,Select,Input, message} from 'antd'
import {PlusOutlined} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from '../../utils/memoryUtils'
const Option = Select.Option
//Product的默认子路由组件
export default class ProductHome extends Component{

    state={
        products:[],//商品的数组
        total:0,//商品的总数量
        loading:false,//是否正在加载
        searchName:'',//搜索名称
        searchType:'productName',//根据那个字段搜索
        search:0,
    }
    updateStatus = async(productId,status) => {
        const result = await reqUpdateStatus(productId,status)
        if(result.status===0)
        {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
        else{
            message.error('更新商品失败')
        }
    }
    initColumns(){
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              //指定了dataIndex，传的就是price了，而不是product了
              render:(price)=> '￥'+ price
            },
            {
                width:100,
                title: '状态',
                render:(product)=> {
                    const {status,_id} = product
                    return (
                        <span>
                            <Button type='primary' 
                            onClick={() => this.updateStatus(_id,status===1?2:1)}>{status===1?'下架':'上架'}</Button>
                            <span>{status===1?'在售':'已下架'}</span>
                        </span>
                    )
                }
              },
              {
                width:100,
                title: '操作',
                render:(product)=> {
                    // console.log(product,'product')
                    return (
                        <span>
                            {/* <LinkButton onClick={() => this.props.history.push('/product/detail',{product})}>详情</LinkButton> */}
                            {/* <LinkButton onClick={() => this.props.history.push('./product/addupdate',product)}>修改</LinkButton> */}

                            <LinkButton onClick={()=> this.showDetail(product)}>详情</LinkButton>
                            <LinkButton onClick={() => this.showUpdate(product)}>修改</LinkButton>
                        </span>
                    )
                }
              },
          ];

    }

    showDetail = (product) =>{


        //缓存product对象 给detail使用
        memoryUtils.product = product
        // console.log('???',memoryUtils.product)

        this.props.history.push('/product/detail')
    }

    showUpdate = (product) =>{
        memoryUtils.product = product
        console.log(product);
        this.props.history.push('/product/addupdate')
    }

    //获取指定页面的列表数据显示
    //要是像他那样写在一个函数里，不加是否曾经点过搜索，直接点其他页也会触发条件搜索，我感觉那是bug
    getProducts = async (pageNum)=>{
        this.pageNum = pageNum //保存一下现在是第几页
        this.setState({loading:true})
        const {searchName,searchType,search} = this.state

        let result
        if(search)
        {
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }
        else
        {
            result = await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})
        if(result.status===0)
        {
            const {total,list} = result.data
            this.setState({
                total,
                products:list
            })
        }
    }



    UNSAFE_componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getProducts(1)

    }

     render(){

        const {products,total,loading,searchName,searchType,search} = this.state

         const title = (
             <span>
                 <Select value={searchType} style={{width:150}} onChange={value => this.setState({searchType:value})}>
                   <Option value='productName'>按名称搜索</Option>
                   <Option value='productDesc'>按描述搜索</Option>
                 </Select>
                 <Input 
                 placeholder='关键字' 
                 style={{width:150,margin:'0 15px'}} 
                 value={searchName} 
                 onChange={event => this.setState({searchName:event.target.value})}
                 />
                 <Button type='primary' onClick={()=> 
                    {
                        if(searchName)
                            this.setState({search:1},()=>{this.getProducts(1)})
                        else
                            this.setState({search:0},()=>{this.getProducts(1)})
                  } }>搜索</Button>
             </span>
         )

         const extra = (
             <Button icon={<PlusOutlined />} type='primary' onClick={()=>this.props.history.push('/product/addupdate')} >
                 添加
             </Button>
         )

        
          
         
        return (
            <Card title={title} extra={extra}>
                <Table 
                loading={loading}
                bordered
                rowKey='_id'
                dataSource={products}
                columns={this.columns}
                pagination={{
                    current:this.pageNum,
                    defaultPageSize:PAGE_SIZE,
                    showQuickJumper:true,
                    total:total,
                    onChange:this.getProducts
                }}
                //不写total的话他会认为你dataSouce里的数量就是total，而我们这是后端控制的分页，只有每页的数据，所以要自己写上总页数
                //onChange会在页码改变后自动传page和pageSize。所以直接这么写就行了
                >

                </Table>
            </Card>
        )
    }
}