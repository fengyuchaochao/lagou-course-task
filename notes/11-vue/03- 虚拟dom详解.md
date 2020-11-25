# 虚拟 Dom


## 什么是虚拟Dom？

虚拟dom，其实就是一个普通的javascript对象，用来描述真实dom，相当于真实dom，创建一个虚拟dom的开销要小很多，因为一个真实dom有很多很多的属性。

![image](http://note.youdao.com/yws/res/13334/5CD9E708BBFE426F84CE32B63B8CEF7C)

## 为什么需要虚拟Dom？

首先想象操作真实dom有哪些问题？
1. dom操作很麻烦，开发成本比较高，渲染开发比较大
2. 很难追踪以前的dom状态。

相应的虚拟dom也就解决了这些问题：
1. 虚拟dom是普通javascript对象，所以很容易跟踪上一次的状态
2. 可以通过diff前后的虚拟dom，只需要更新变化的dom，不需要更新整个dom，减少无用开销。

注意：

1. 并不能说虚拟dom的渲染性能就一定比真实dom好，如果只是一些简单的dom操作，很显然直接操作dom会更加方便，如果使用虚拟dom的话，还需要引入额外的一些javascript对象，所以虚拟dom渲染性能一般只是在复杂视图中，性能会更高。


## 虚拟dom库： Snabbdom

 snabbdom是一个虚拟dom的开源库，vue2.x内部使用snabbdom进行改造的。

#### 基本使用

```
//index.js
import {h, init} from 'snabbdom';

//引入模块：snabbdom中的模块需要额外引入，没有集成中snabbdom核心库中。
import style from 'snabbdom/modules/style';
import eventlisteners from 'snabbdom/modules/eventlisteners';

//注册模块
let patch = init([style, eventlisteners]);

let vnode = h('div#container', {
    style: {
        backgroundColor: 'green',
        height: '200px'
    },
    on: {
        click: () => {
            alert('点击事件');
        }
    }
}, [
    h('h1', '标题'),
    h('p', '内容')
]);

let app = document.querySelector('#app');
patch(app, vnode);
```
```
//index.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <div id="app"></div>
    <script src="./src/01-basic.js"></script>
</body>
</html>

```

从上面的代码实例中，我们可以清晰的感受到vue中创建虚拟dom的语法完全和snabbdom一致，因为vue中底层引用的就是snabbdom来实现虚拟dom的。

#### 源码解析

这里主要看一下主体的几个方法
* h()
* init()
* vnode
* patch()

##### 一. h()函数

h()函数的主要作用：创建vnode

![image](http://note.youdao.com/yws/res/13372/083618BA3692489BA16C02C297FA2420)

上图是h函数源码中的截图，从图中可以看到，由于使用ts实现的，而且h()函数可以传不同个数的参数，所以这里就采用了**函数重载**的形式，去兼容不同个数参数的情况，当然，由于最终都需要转换成javascript代码，我们也可以看到最后一个函数也实现了在函数内部去判断不同参数个数的不同处理逻辑。

##### 二. vnode

vnode即规定了如何去定义一个虚拟dom，我们可以看到源代码中：

![image](http://note.youdao.com/yws/res/13383/7DB3AA6EE2A44FAD9871E497D56558A7)

从图中可以看出，一个vnode包含了如上属性，我们可以实际打印一个：

![image](http://note.youdao.com/yws/res/13387/F670A2A3AD644C3DA0ADA103F16277EB)

以后遇到类似结构的对象，我们要想到它可能就是一个虚拟dom。

##### 三. patch()

![image](http://note.youdao.com/yws/res/13390/10FF8C42BE9243B1AE86FC9306C3BB91)

