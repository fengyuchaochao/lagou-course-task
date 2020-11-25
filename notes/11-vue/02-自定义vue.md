# 模拟vue响应式原理

## 核心概念理解

* 数据响应式
* 双向绑定
* 数据驱动
* 发布订阅模式
* 观察者模式

#### 数据响应式

所谓数据响应式，其实就是数据变化之后，我们可以监听到，从而执行相关操作，在vue中，体现出来的就是：数据变化以后，视图自动更新，不需要我们手动进行dom操作。

数据响应式实现原理：
* vue2: Object.defineProperty() 该属性是一个无法shim(降级处理)的特性，这也是vue不支持ie8以下浏览器的原因。
* vue3: Proxy 


#### 双向绑定
即数据变化以后，视图更新，视图变化，数据也会更新。

#### 数据驱动
它一种开发思想，即我们只需要关注数据本身，不需要关注数据式是如何渲染到视图上，其原理本质上就是数据响应式+双向绑定。

#### 发布订阅模式与观察者模式

![image](http://note.youdao.com/yws/res/13255/A052E37B6E9F407D90AB3A4246A35DA1)

**1. 发布订阅模式**

vue中的自定义事件，以及eventbus本质上都是采用发布订阅模式去实现的。

发布订阅模式：包含三个角色
* 发布者
* 订阅者
* 事件中心

其中发布者和订阅者没有直接依赖，都是通过事件中心进行交互，事件中心相当于经纪人的一个角色。
```
class EventEmitter {
    constructor () {
        this.subs = Object.create(null);
    }
    //注册事件
    $on (eventType, handler) {
        this.subs[eventType] =  this.subs[eventType] || [];
        this.subs[eventType].push(handler)
    }
    //触发事件
    $emit (eventType) {
        if (this.subs[eventType]) {
            this.subs[eventType].forEach(handler => {
                handler();
            })
        }
    }
}

let eventEmitter = new EventEmitter();
eventEmitter.$on('click', () => {
    console.log('click1')
});
eventEmitter.$on('click', () => {
    console.log('click2')
});
eventEmitter.$on('change', () => {
    console.log('change')
});

eventEmitter.$emit('change');
eventEmitter.$emit('click');

```

**2. 观察者模式**

观察者模式只有两个角色：观察者（订阅者）和发布者，没有事件中心

* Dep 发布者
    * subs 记录所有的订阅者
    * addSub 添加订阅者
    * notify 当事件发生时，调用订阅者的update方法
* Watcher 订阅者
    * update 当事件发生时具体要做的事情


```
class Dep {
    constructor () {
        this.subs = []; //记录所有的订阅者
    }
    addSub (sub) {
        if (sub && sub.update) {
            this.subs.push(sub)
        }
    }
    notify () {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}
class Watcher {
    update () {
        console.log('update')
    }
}

let dep = new Dep();
let watcher = new Watcher();
dep.addSub(watcher);
dep.notify();

```

## 实现最小版本的vue

基本流程如下：
![image](http://note.youdao.com/yws/res/13279/11272817BBED4DCDA196FD257B9B2743)

常见概念理解：

1. vue中可以使用Vue.observable()把任意对象转换成响应式对象。
2. Dep类的作用是收集依赖，每个属性都对应一个Dep对象，当属性值变化时，就会调用notify方法通知更新视图。
3. 1个Dep对象可能对应多个Watcher对象，当数据发生变化时，Dep会调用notify通知更新视图，注意是通知，而真正执行视图更新的操作是在Watcher的update方法中。
4. 注意添加订阅者的时机，也就是说Watcher初始化的时机，很显然，是要根据哪个视图用到了数据，则在这个视图渲染的地方去初始化watcher对象。例如：属性name 同时在页面中的3个节点有用到，那么该属性对应的Dep就会被添加3个watcher对象，然后当name属性值发生变化时，Dep负责通知更新，然后依次执行这3个watcher对象指定的callback，从而更新视图。


<b>
个人理解总结：

简单来说实现一个迷你vue最核心的几点：
1. 首先是初始化Vue实例，传入所需data等数据。
2. 通过Observer将data变成响应式数据，也就是说我们可以监听到每个属性的读取与写入。
3. 通过Compiler去编译模版，解析模版中的差值表达式，指令等数据。
4. 最后通过观察者模式，为每个属性创建一个Dep对象，同时在视图渲染的地方去初始化Watcher对象，初始化Watcher对象的同时，会将当前watcher实例添加到Dep类的subs中，当数据变化时，直接调用Dep的notify即可。

</b>


## 完整代码

```
//index.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div id="app">
    <h1>{{msg}}</h1>
    <h2 v-text="msg"></h2>
    <h3>{{count}}</h3>
    <input type="text" v-model="msg">
    <input type="text" v-model="count">
</div>
<script src="./js/dep.js"></script>
<script src="./js/watcher.js"></script>
<script src="./js/compiler.js"></script>
<script src="./js/observer.js"></script>
<script src="js/vue.js"></script>
<script>
let vm = new Vue({
    el: '#app',
    data: {
        msg: 'hello world',
        count: 100,
        person: {
            name: 'kobe'
        }
    }
});
</script>
</body>
</html>

```
```
//vue.js

/**
 * 
 * 1. 通过属性保存选项的数据
   2. 调用data中的成员将其转换成getter/setter，并且注入到vue实例中
   3. 调用observer对象，监听数据的变化
   4. 调用compiler对象，解析指令和差值表达式
 * */
class Vue {
    constructor (options) {
        //1. 通过属性保存选项的数据
        this.$options = options || {};
        this.$data = options.data || {};
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;

        //2. 调用data中的成员将其转换成getter/setter，并且注入到vue实例中
        this._proxyData(this.$data);

        //3. 调用observer对象，监听数据的变化
        new Observer(this.$data);

        //4. 调用compiler对象，解析指令和差值表达式
        new Compiler(this);
    }
    _proxyData (data) {
        //遍历data中的属性，并且转换成getter/setter，将其注入vue实例中
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get () {
                    return data[key];
                },
                set (newVal) {
                    if (newVal === data[key]) {
                        return;
                    }
                    data[key] = newVal;
                }
            })
        })
    }
}

```
```
//observer.js
/**
 * Observer类的主要功能如下：
 *  核心功能就是将data数据变成响应式数据，当然其中会有一些细节：
 *  1. 首先将vue对象初始化传入的对象 变成响应式对象
 *  2. 当手动给某个属性赋值了一个对象时，也需要将这个新对象变成响应式对象
 *  3. 当添加一个新的属性和属性值时，也需要将该数据变成响应式
 * 
 * */

class Observer {
    constructor (data) {
        this.walk(data)
    }
    //遍历data所有属性，
    walk (data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        Object.keys(data).forEach(key => {
           this.defineReactive(data, key, data[key]);
        });
    }
    //将data所有属性值变成响应式数据
    defineReactive (obj, key, val) {
        let that = this;
        let dep = new Dep(); //负责收集依赖，并且发送通知
        this.walk(val); //如果data的属性值也是对象，则需要再次遍历
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get () {
                Dep.target && dep.addSub(Dep.target); //收集依赖
                return val;
            },
            set (newVal) {
                if (newVal === val) return;
                val = newVal;
                that.walk(val); //当data的属性被赋值为一个对象时，需要我们手动将新赋值的对象变成响应式数据。
                dep.notify(); //发送通知
            }
        })
    }
}

```
```
//compiler.

/**
 * Compiler类的主要作用就是：解析html，
 * 
 * 因为html中可能包含 差值表达式，指令等自定义语法，需要我们手动去解析这些语法，然后替换成真实的数据。
 * 
 * */
 
class Compiler {
    constructor (vm) {
        this.el = vm.$el;
        this.vm = vm;

        this.compile(this.el);
    }

    //编译模版，处理我们的文本节点和元素节点
    compile (el) {
        let childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compileText(node);
            } else if (this.isElementNode(node)) {
                this.compileElement(node);
            }
            //判断node是否有子节点，如果有，则需要递归调用compile
            if (node.childNodes && node.childNodes.length) {
                this.compile(node);
            }
        })
    }

    //编译元素节点，处理指令
    compileElement (node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                attrName = attrName.substr(2);
                let key = attr.value;
                this.update(node, key, attrName);
            }
        })
    }
    //统一处理指令的方法
    update (node, key, attrName) {
        let updateFn = this[`${attrName}Updater`];
        updateFn && updateFn.call(this, node, key, this.vm[key]);
    }
    //处理v-text指令
    textUpdater (node, key, value) {
        node.textContent = value;

        //创建watcher实例，当数据改变时更新视图
        new Watcher(this.vm, key, (newVal) => {
            node.textContent = newVal;
        })
    }
    //处理v-model指令
    modelUpdater (node, key, value) {
        node.value = value;
        //实现双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value;
        });

        //创建watcher实例，当数据改变时更新视图
        new Watcher(this.vm, key, (newVal) => {
            node.value = newVal;
        })
    }
    //处理文本节点，处理差值表达式
    compileText (node) {
        let reg = /\{\{(.+?)\}\}/g;
        let value = node.textContent;
        if (reg.test(value)) {
            let key = RegExp.$1.trim();
            // node.textContent = value.replace(reg, this.vm[key]);
            node.textContent = this.vm[key];

            //创建watcher实例，当数据改变时更新视图
            new Watcher(this.vm, key, (newVal) => {
                node.textContent = newVal;
            })
        }
    }
    // 判断元素属性是否是指令
    isDirective (attrName) {
        return attrName.startsWith('v-');
    }
    //判断节点是否是文本节点
    isTextNode (node) {
        return node.nodeType === 3;
    }
    //判断节点是否是元素节点
    isElementNode (node) {
        return node.nodeType === 1;
    }
}

```
```
//dep.js

/**
 * Dep类的作用：
 * 主要就是负责收集依赖，这里的依赖其实就是收集watcher实例，并且存储到subs里，
 * 当数据发生变化时，执行notify方法去通知更新视图。
 * 
 * */
 
class Dep {
    constructor () {
        this.subs = []; //存储所有的观察者
    }
    //添加观察者
    addSub (sub) {
        if (sub && sub.update) {
            this.subs.push(sub);
        }
    }
    //发送通知
    notify () {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}

```
```
//watcher.js

/**
 * Watcher类主要要实现两个功能：
 * 1. Watcher实例化的时候，要将当前实例添加到Dep类的subs中。
 * 2. 当数据发生变化时，要通知所有的watcher实例，执行相应的操作。
 * */

class Watcher {
    constructor (vm, key, cb) {
        this.vm = vm;
        this.key = key;
        this.cb = cb;
        //当Watcher初始化时，需要将当前Watcher实例记录到Dep类的静态属性target当中，
        Dep.target = this;
        //同时，触发get方法，在get方法中执行addSub, 从而将当前Watcher实例添加到Dep类的subs中。
        this.oldVal = vm[key];
        Dep.target = null; //添加到Dep中subs之后，要置为空
    }
    update () {
        let newVal = this.vm[this.key];
        if (newVal === this.oldVal) return;
        this.cb(newVal);
    }

}

```
