# 虚拟DOM


## 为什么要使用虚拟dom？

1. 使用虚拟dom，可以避免直接操作dom，提高开发效率，
2. 作为一个中间件，可以跨平台
3. 虚拟dom不一定可以提高性能
    * 首先渲染的时候一定会增加开销（因为维护了一层虚拟dom的对象）  
    * 复杂视图中，提升渲染性能，尤其是更新视图的时候，不需要全部更新，只需要diff之后局部更新。
    
## vue中如何使用虚拟dom？

```
new Vue({
    data () {
        return {
            msg: '123'
        }
    },
    render (h) {
        let vnode = h('h1', {
            domProps: {
                innerHtml: this.msg
            }
        }, '标题')
    }
});
```
说明：
1. h函数就是vue实例中的$createElement函数，专门用于创建一个vnode对象。

![image](http://note.youdao.com/yws/res/13798/F4854A0AF2214540B54E77CF025BC107)



2. h函数的参数，可以使用2个参数，也可以使用3个参数。

![image](http://note.youdao.com/yws/res/13792/739A3F159F6544F8B715419FC1B11DC1)
3. vnode对象有几个核心属性我们需要知道：
    * tag：即当前组件的标签
    * data：即我们传入的相关配置
    * children: 即当前组件的子组件
    * text：即当前组件的文本
    * elm：即当前组件对应的真实dom
    * key: 用于标识组件的唯一性，主要作用是提高渲染性能

## 源码分析


#### 一. render与update
主体思路：
1. 调用render函数，返回vnode。
2. 调用update函数，将vnode转换成真实dom

![image](http://note.youdao.com/yws/res/13829/CA79513AF6D942B4952BED5F44912E32)

说明：
1. render函数内部：如果是在vue实例中显式调用render函数，则其实内部调用的是$createElement函数，如果是构建打包之后生成的render函数，则内部其实调用的是_c函数。
2. 调用update函数，将虚拟dom渲染成真实dom，这个过程中最核心的当然还是patch函数，即具体是如果通过diff算法，渲染成真实dom的。

接下来就主要来看看patch函数：


#### 二. patchVnode

![image](http://note.youdao.com/yws/res/13841/1CF67A6E66EF42B1949997967506BDD8)

patchVnode的具体流程：

patchVnode的作用就是对比新旧vnode的差异，以及新旧vnode的子节点的差异，那对比的主要方向就是从该节点是否是文本节点，是否有子节点两方面去比较。

1. 首先是旧vnode有文本或者子节点，而新vnode没有，则直接remove掉旧vnode中文本或者子节点，相反则直接在旧vnode中插入文本或者子节点。
2. 如果新旧vnode都有文本或者子节点，则需要具体再比较啦，如果类型不一样，例如旧vnode有文本，新vnode有子节点，则直接remove掉旧vnode文本，插入新的子节点即可。
3. 接下来主要是考虑类型一样的时候，如果新旧vnode都有文本，直比较文本是否相同，替换旧文本即可，
4. 如果新旧vnode都有子节点，则需要调用updateChildren来具体比较子节点的情况啦。

#### 三. updateChildren
updateChildren的具体流程：

这里要强调一下，updateChildren函数其实是两个节点之前diff比较的核心。





#### key的作用

在vue中，key的作用其实就是为了标识vnode的唯一性，例如，一个ul下面有多个li标签，我们为了li设置一个唯一的标识，就是为了数据更新以后，我们只需要重新渲染变更的li，不需要全部进行重新渲染。


diff算法参考：
1. https://segmentfault.com/a/1190000008782928
2. https://zhuanlan.zhihu.com/p/76384873

