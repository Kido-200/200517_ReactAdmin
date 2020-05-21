import {
    AppstoreOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    UnorderedListOutlined,
    SmileOutlined,
    MailOutlined,
    AreaChartOutlined,
    PieChartOutlined,
    BarChartOutlined,
    LineChartOutlined

  } from '@ant-design/icons';
import React from 'react'

const menuList=[
    {
        title:'首页',
        key:'/home',
        icon:<MailOutlined />
    },
    {
        title:'商品',
        key:'/products',
        icon:<AppstoreOutlined />,
        children:[
            {
                title:'品类管理',
                key:'/category',
                icon:<UnorderedListOutlined />
            },
            {
                title:'商品管理',
                key:'/product',
                icon:<ShoppingCartOutlined />
            }
        ]
    },
    {
        title:'用户管理',
        key:'/user',
        icon:<UserOutlined />
    },
    {
        title:'角色管理',
        key:'/role',
        icon:<SmileOutlined />
    },
    {
        title:'图形图表',
        key:'/charts',
        icon:<AreaChartOutlined />,
        children:[
            {
                title:'柱形图',
                key:'/charts/bar',
                icon:<BarChartOutlined />
            },
            {
                title:'折线图',
                key:'/charts/line',
                icon:<LineChartOutlined />
            },
            {
                title:'饼图',
                key:'/charts/pie',
                icon:<PieChartOutlined />
            },
        ]
    },
]

export default menuList