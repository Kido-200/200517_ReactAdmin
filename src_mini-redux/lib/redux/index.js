/*
redux库的主模块
1)	redux库向外暴露下面几个函数
createStore():接受的参数为reducer函数，返回store对象
combineReducers():接受包含n个reducer方法的对象，返回一个新的reducer函数
applyMiddleware()//暂不实现
2)	store对象的内部结构
getState():返回值为内部保存的state
dispatch():参数为action对象
subscribe():参数为监听内部state更新的回调函数
*/


//根据reducer函数创造一个store对象
export function createStore(reducer){

    //初始值为调用reducer函数返回的结果(外部指定的默认值)
    let state = reducer(undefined,{type:'@@redux/init'})
    //用来存储监听state更新回调函数的数组容器
    const listeners = []

    //返回当前内部的state数据
    function getState(){
        console.log(this,this.state,state);
        return state
    }
    
    /*
    分发action
    1)触发reducer调用，产生新的state
    2)保存新的state
    3)调用所有已存在的监视回调函数

    */
    function dispatch(action){
       const newState = reducer(state,action)
        state = newState
        //调用监听的函数
        listeners.forEach(listener => listener())
    }
    //绑定内部state改变的监听回调
    function subscribe(listener){
        //保存缓存listener的容器数组中
        listeners.push(listener)
    }

    //返回store对象
    return {
        getState,
        dispatch,
        subscribe
    }
}

//整合传入参数对象中的包含多个reducer的函数，返回一个新的reducer函数
//新的reducer管理的总状态:{}
export function combineReducers(reducers){
    //返回一个新的reducer函数,dispatch(action)时会调用他
    //state：总状态 {count:count(state.count,action),user:user(state.user,action)}
    return (state={},action) => {  
        const newState = Object.keys(reducers).reduce((prev,key)=>{
            prev[key] = reducers[key](state[key],action)
            return prev
        },{})
        return newState
    }
}
