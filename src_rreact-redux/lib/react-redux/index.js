import React from 'react'
import PropTypes from 'prop-types'
/*
react-redux模块
*/

/*向所有容器组件提供store的组件类
通过context向所有的容器组件提供store
*/
export class Provider extends React.Component{

    static propTypes = {
        store:PropTypes.object.isRequired
    }

    static childContextTypes = {
        store:PropTypes.object
    }

    //向所有有声明子组件提供包含要传递数据的context对象
    getChildContext (){
        return {
            store: this.props.store
        }
    }
    

    render(){
        //返回渲染provider所有子组件

        return this.props.children
    }
}

/*
connect高阶函数：接受mapStateToProps和mapDispatchToProps两个参数
返回一个高阶组件函数
接受一个UI组件，返回一个容器组件
*/

export function connect(mapStateToProps,mapDispatchToProps){
    //返回高阶组件函数
    return (UIComponent) => {
        //返回容器组件
        return class ContainerComponent extends React.Component{

            //声明接受的context数据的名称和类型

            static contextTypes = {
                store:PropTypes.object
            }

            constructor(props,context){
                super(props)
                console.log('constructor()',context.store)

                //得到store
                const {store} = context
                //得到包含所有一般属性的对象

                const stateProps = mapStateToProps(store.getState())
                //将所有一般属性作为容器组件的状态数据
                this.state = {...stateProps}
                //得到包含所有函数属性的对象
                let dispatchProps;
                //用户写的函数
                if(typeof mapDispatchToProps ==='function')
                {
                    dispatchProps = mapDispatchToProps(store.dispatch)
                }
                //用户写的对象,对象的属性是一个个需要dispatch函数
                else{
                    dispatchProps = Object.keys(mapDispatchToProps).reduce((pre,key)=>{
                        const actionCreator = mapDispatchToProps[key]
                        //参数透传 前面是收集成一个数组，后面是展开数组
                        pre[key] = (...args) => store.dispatch(actionCreator(...args)) 
                        return pre
                    },{})
                }
                this.dispatchProps = dispatchProps

                //绑定store的state变化的监听
                store.subscribe(()=>{
                    //store内部的状态数据发生了变化
                    //更新容器组件 ==>UI组件更新
                    //注意此时的{...}的 {}是表示对象，而不是表示这是JS代码，和下面那个有区别
                    this.setState({...mapStateToProps(store.getState())})
                })
            }

            render(){
                //返回UI组件的标签
                return <UIComponent {...this.state} {...this.dispatchProps}/>
            }
        }
    }
}