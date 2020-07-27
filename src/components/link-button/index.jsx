import React from 'react'
import './index.less'

//外形像链接的按钮
//标签里的<>xxx<>  xxx也会变成props的属性props.children 注意这个xxx也可能是标签
//写{...props}会被自动放进这个button的xxx了
export default function LinkButton(props){

    return <button {...props} className="link-button"></button>
}