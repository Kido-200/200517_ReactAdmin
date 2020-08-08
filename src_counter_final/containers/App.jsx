import React,{Component} from 'react'
import {connect} from 'react-redux'
// import {connect} from 'react-redux'


import Counter from '../components/Counter'
import {increment,decrement,incrementAsync} from '../redux/actions.js'
/*
容器组件：通过connect包装UI组件产生的组件
connect(): 高阶函数
connect()返回的函数时一个高阶组件：接受一个UI组件，生成一个容器组件
容器组件的责任：向UI组件传入特定的属性
*/

// function mapStateToProps(state){
//     return {
//         count:state
//     }
// }

//函数写法，会自动调用得到对象，将对象中的方法作为函数属性传入UI组件
// function mapDispatchToProps(dispatch){
//     return {
//         increment: (number) => dispatch(increment(number)),
//         decrement: (number) => dispatch(decrement(number)),
//     }
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Counter)


export default connect(
    state => ({count:state.count}),
    {increment,decrement,incrementAsync}//这里以后调用的话应该是自动dispatch这两个函数了
)(Counter)

