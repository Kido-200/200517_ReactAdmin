import React, {Component} from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Upload,
    Button,
    message
} from 'antd'
import {LeftOutlined} from '@ant-design/icons'

import PicturesWall from './pictures-wall'
import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api/index'
import RichTestEditor from './rich-text-editor'
import memoryUtils from '../../utils/memoryUtils'

const {Item} = Form
const {TextArea} = Input



  
//Product的添加和更新的子路由组件
export default class ProductAddUpdate extends Component{

    constructor(...props)
    {
        super(...props)
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    
    componentWillUnmount(){
        memoryUtils.product = {}
    }

    state = {
        options:[]
    }
    formRef = React.createRef()

    initOptions = async (categorys) => {
        //根据categorys生成options数组
        const options  = categorys.map(c => ({
            value:c._id,
            label:c.name,
            isLeaf:false,
        }))

        //如果是点击修改并且是个二级分类商品的更新
        const {isUpdate,product} = this
        const {pCategoryId,categoryId} = product
        if(isUpdate&&pCategoryId!=='0')
        {
            //获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value:c._id,
                label:c.name,
                isLeaf:true
            }))
            //找到父亲option,返回对应地址
            const targetOptions = options.find(option => option.value==pCategoryId )
            // console.log('bug',options,pCategoryId,categoryId)
            targetOptions.children = childOptions
        }

        this.setState({
            options
        })
    }


    submit = ()=>{
        // 进行表单验证
        this.formRef.current.validateFields().then( async values => {
            const {name,desc,price,categoryIds} = values
            let pCategoryId,categoryId
            if(categoryIds.length==1)
            {
                pCategoryId = 0
                categoryId = categoryIds[0]
            }
            else{
                pCategoryId = categoryIds[0]
                categoryId = categoryIds[1]
            }
            const imgs = this.pw.current.getImgs()
            const detail = this.editor.current.getDetail()
            const product = {
                name,
                desc,
                price,
                imgs,
                detail,
                pCategoryId,
                categoryId
            }
            // console.log(this.isUpdate)
            if(this.isUpdate){
                product._id = this.product._id
            }
            const result = await reqAddOrUpdateProduct(product)
            if(result.status===0)
            {
                message.success(`${this.isUpdate?'更新':'添加'}商品成功`)
                this.props.history.goBack()
            }
            else{
                // console.log(result)
                message.error(`${this.isUpdate?'更新':'添加'}商品失败`)
            }
        }).catch(err=>{
            alert("错误",err)
            console.log("错误",err)
        })
    }


    //验证价格的自定义验证函数
    validatePrice = async (rule,value,callback) => {
        if(value*1<0)
        {
            throw new Error('价格必须>0');
        }
    }

    //根据选中的分类，请求获取二级分类列表
    //用于加载下一级列表的回调函数
    loadData = async selectedOptions => {
        //得到选择的option对象
        const targetOption = selectedOptions[0];
        //显示loading
        targetOption.loading = true;
    
        //根据选中的分类，请求二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        if(subCategorys&&subCategorys.length>0){
            const cOptions = subCategorys.map(c=> ({
                value:c._id,
                label:c.name,
                isLeaf:true
            }))
            targetOption.children = cOptions
        }
        else{
            //没有二级分类
            targetOption.isLeaf = true
        }

          //更新options，前面获取的targetOption应该是地址，所以是直接改的state里的options，但还是要setState一下来调用render
          this.setState({
            options: [...this.state.options],
          });
      };
    
      getCategorys = async (parentId) =>{
        const result = await reqCategorys(parentId)
        if(result.status===0)
        {
            const categorys = result.data
            if(parentId==='0')
           {
            this.initOptions(categorys)
           } 
          else{
            return categorys //成功的话返回这个promise对象
          }
        }
      }

      componentDidMount(){
        this.getCategorys('0')
      }

      componentWillMount(){
          //取出携带的state
          //如果是修改，location.state我们传了product，添加的话就是空
          const product = memoryUtils.product
          //强制转成bool类型
          this.isUpdate = !!product._id
          this.product = product||{}
      }

     render(){

        const {isUpdate,product} = this
        const {pCategoryId,categoryId,imgs,detail} = product
        const categoryIds = []
        if(isUpdate)
        {
            //商品是二级分类的
            if(pCategoryId!=='0')
                {

                    categoryIds.push(pCategoryId)
                }
            categoryIds.push(categoryId)
        }
        const title = (
             <span>
                 <LinkButton onClick={() => this.props.history.goBack()}>
                    <LeftOutlined style={{fontSize:20}} />
                 </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品' }</span>
             </span>
         )
         
        const layout = {
            labelCol:{
                span:2,
            },
            wrapperCol:{
                span:8,
            }
        }
        

        return (
           <Card title={title}>
               <Form 
               {...layout} 
               ref={this.formRef}
               initialValues={{
                   name:product.name,
                   desc:product.desc,
                   price:product.price,
                   categoryIds,
               }}
               >
                   <Item 
                   label="商品名称:"
                   //写了namerules的required才会起作用
                   name="name"
                   rules={[
                       {
                        required:true,
                        message:'商品名称必须输入',

                       },
                       
                   ]}
                   >
                     <Input 
                     placeholder="请输入商品名称" 
                     />
                   </Item>
                   <Item 
                   label="商品描述"
                   name="desc"
                   rules={[
                    {
                     required:true,
                     message:'商品描述必须输入'
                    }
                ]}
                   >
                        
                        <TextArea autoSize={{minRows:4}} />
                   </Item>

                   <Item 
                   label="商品价格:"
                   //写了name  rules的required才会起作用
                   name="price"
                   rules={[
                       {
                        required:true,
                        message:'商品价格必须输入'
                       },
                       {
                        validator:this.validatePrice
                        }
                   ]}
                   >
                     <Input type="number" placeholder="请输入商品价格" addonAfter='元' />
                   </Item>
                   <Item 
                   label='商品分类'
                   name='categoryIds'
                   rules={[
                    {
                     required:true,
                     message:'商品分类必须输入'
                    }
                ]}
                   >

                   <Cascader
                        placeholder='请指定商品分类'
                        options={this.state.options} //需要显示的列表数据
                        loadData={this.loadData}     //选择某个列表项，加载下一级列表的监听回调
                    />

                   </Item>
                   <Item label="商品图片" >
                        <PicturesWall ref={this.pw} imgs={imgs} />
                   </Item>
                   <Item label="商品详情" labelCol={{span:2}} wrapperCol={{span:20}}>
                   <RichTestEditor ref = {this.editor} detail={detail} />
                   </Item>
                   <Item>
                       <Button type='primary' onClick={this.submit}>提交</Button>
                   </Item>
               </Form>
           </Card>
        )
    }
}

//1.子组件调用父组件的方法：将父组件的方法以函数属性形式传给子组件
//2.父组件调用子组件的方法：在父组件种通过ref得到子组件标签对象，调用其方法