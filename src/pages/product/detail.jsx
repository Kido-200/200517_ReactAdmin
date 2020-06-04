import React, {Component} from 'react'
import {Card,
List,
} from 'antd'

import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api/index'

const Item = List.Item

export default class ProductDetail extends Component{

    state ={
        cname1:'',//一级分类名称
        cname2:''//二级分类名称
    }

    async componentDidMount(){
        console.log('do')
        const {pCategoryId,categoryId} = this.props.location.state.product
        if(pCategoryId==='0')
        {
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        }
        else{
            /*
            //要等上一个await执行完才会执行，所以效率太差了
            const result1 = await reqCategory(pCategoryId)
            const result2 = await reqCategory(categoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            */
           //一次性发送多个请求,只有都成功了，才正常处理
           const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
           const cName1 = results[0].data.name
           const cName2 = results[1].data.name
           this.setState({cName1,cName2})
        }
        
    }

     render(){
        const {name,desc,price,detail,imgs} = this.props.location.state.product
        const {cName1,cName2} = this.state
        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined 
                    style={{color:'green',marginRight:15,fontSize:20}} 
                    onClick = { () => {this.props.history.goBack()}}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格:</span>
                        <span>{price}</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类:</span>
                        <span>{cName1} {cName2? '-->'+cName2 : ''} </span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片:</span>
                       {
                           imgs.map(img => (
                               <img 
                               key={img}
                               className='product-img'
                               src={BASE_IMG_URL + img}
                               alt='img'
                               />
                           ))
                       }
                    </Item>
                    <Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}