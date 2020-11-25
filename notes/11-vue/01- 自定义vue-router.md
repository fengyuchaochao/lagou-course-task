# Vue Router


## 基本使用

```
//router.js
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Home from './home';

export default new VueRouter({
    routes: [
        {
            path: '/'
            component: Home
        },
        {
            path: '/detail/:id',
            props: true,
            component: import(/* webpackChunkName */ './detail');
        }
    ]
});

```
```
//main.js
import Vue from 'vue';
import router from './router.js';

new Vue({
    router,
}).$mount('#app');
```
说明：
1. 在创建vue实例中添加router的作用：在vue实例中会添加$route和$router两个属性，这样我们在vue实例中就可以使用这两个属性内部的方法了。
2. 动态路由：即案例中的/detail/:id其实就是动态路由的体现，我们可以动态修改路由中的id，同时，如何接受动态路由的参数呢？
```
// detail.vue

//方式1
export detault new Vue({
    data () {},
    computed: {
        id () {
            return this.$route.params.id;
        }
    }
});
//方式2: 前提是需要在路由配置中声明props: true
export detault new Vue({
    data () {},
    props: ['id']
});
```
在实际开发中，我们推荐使用方式2。


## Hash与History模式

#### 两者的实现原理

* hash模式：url中#后面的路径即为hash值，hash改变时，我们可以使用hashchange事件进行监听，然后根据不同的hash值去渲染不同的不同的组件。
* history模式：即采用h5新增的pushState方法，该方法会向浏览器中添加一条历史记录，但不会刷新页面，当然历史记录发生改变时，我们可以使用popState事件监听到，然后根据不同的路由地址去渲染不同的组件。

我们上面的介绍，我们会发现，使用hash模式和history模式，当前url发生变化的时候，页面都不会发生改变，我们vue-router也正是利用该机制在监听url发生变化，来手动的渲染不同的组件。

但两者有什么区别呢？继续往下看～

#### 两者的区别

采用hash模式刷新页面的时候，会首先根据页面的hash值去匹配，不会出现404的问题，但是history模式，我们一刷新页面，相当于是从服务器端请求该url，所以会出现404的问题。

也正是因为该原因，history模式需要服务器端支持，那解决方式其实也比较简单，即需要服务器端支持找不到相应url的时候，默认返回index.html文件，然后再根据路由去匹配渲染不同的组件。


1. 使用node搭建服务，并支持history模式
```
const path = require('path');
const express = require('express');
const history = require('connect-history-api-fallback');

const app = express();
app.use(history()); //让node服务支持history模式。

//指定默认的静态html资源
app.use(express.static(path.join(__dirname, '../web'));
app.listen(8888, () => {
    console.log('开启服务');
});
```
2. 使用nginx搭建服务，并且支持history模式
```
server {
    listen 8888;
    server_name localhost;
    
    location / {
        root html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html //添加当前配置，支持history模式
        
    }
}
```

## 模拟实现

如果想自己实现vue-rotuer之前，首先要明确vue-router都要提供哪些功能？以及具体怎么使用？

提供哪些功能？
1. 实现前端路由，监听路由变化时，动态加载指定组件，保证路由变化不请求服务器端，同时历史记录又会变化。
2. 提供router-link以及router-view组件。

那具体怎么使用呢？
1. VueRouter是一个插件，通过Vue.use引入该插件。
2. 将vueRouter实例挂在到vue实例中

接下来，我们就来分析一下CustomVueRouter需要哪些属性和方法？

CustomVueRouter类：
* 属性：
    * options //即我们传入的整个路由配置对象
    * data //用来记录当前路由，借助Vue.observable将该属性变成可监听的，从而实现当前路由变化时，自动执行某些操作。
    * routeMap //即路由-组件的映射表.
* 方法：    
    * constructor //构造函数，用于初始化路哟配置
    * install //插件必备方法，调用vue.use时会自动执行该方法，可以在方法中实现一些插件的初始化操作。
    * initRouteMap // 遍历所有路由规则，并且解析成键值对的形式，存储到routeMap对象中。
    * initComponent //创建router-link,router-view等组件
    * initEvent //监听popstate操作，动态渲染组件

这里还是要强调一下，以上是代码实现过程所需要的一些属性和方法，那我们前提还是要理解自定义vuerouter插件的核心思路是什么？

**前提思想：即想要实现单页面应用，就必须要求要有前端自己的路由，当切换前端路由时，要保证不会向服务器端发送请求，同时又可以改变浏览器历史记录，且页面内容发生改变。因此基于hash锚点，以及h5提供的history相关api正好可以满足我们的需求，从而衍生出了hash模式和history模式。**

<b> history模式主体核心思路：
1. 当前路由的信息存储在data.current中，使用Vue.observable将data对象变成一个响应式对象，然后当当前路由发生变化时，router-view组件内部会自动render相应的组件内容。
2. history相关pushState等api可以改变浏览器历史记录，但是浏览器前进回退之后，页面并不会自动去重新渲染，需要我们使用popstate去监听浏览器前进回退操作，从而手动去修改当前路由，进而改变页面内容。
</b>

完整代码如下：
```
let _Vue = null;
class CustomVueRouter {
    static install (Vue) {
        //1. 判断是否安装过vue-router
        if (CustomVueRouter.install.installed) {
            return;
        }
        CustomVueRouter.install.installed = true;
        //2. 定义vue全局变量，其他地方要使用vue中提供的方法
        _Vue = Vue;
        //3. 把向vue实例中传入的router对象注入到vue实例中。
        _Vue.mixin({
            beforeCreate () {
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router;
                    this.$options.router.init();
                }
            }
        })
    }
    constructor (options) {
        this.options = options;
        this.mode = options.mode || 'hash';
        this.routeMap = {};
        this.data = _Vue.observable({
            current: '/'
        })
    }
    init () {
        this.initRouteMap();
        this.initComponent(_Vue);
        this.initEvent();
    }
    initRouteMap () {
        //遍历所有路由规则，并且解析成键值对的形式，存储到routeMap对象中。
        let routes = this.options.routes;
        routes.forEach(route => {
           this.routeMap[route.path] = route.component;
        });
    }
    initComponent (Vue) {
        //创建router-link组件
        let that = this;
        Vue.component('router-link', {
            props: {
                to: String,
            },
            render (h) {
                return h('a', {
                    attrs: {
                        href: this.to
                    },
                    on: {
                        click: this.clickHandler
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler (e) {
                    e.preventDefault();
                    if (that.mode === 'hash') {
                        location.hash = this.to;
                    } else if (this.mode === 'history') {
                        history.pushState(null, '', this.to);
                    }
                    this.$router.data.current = this.to;
                }
            }
            //template: '<a :href="to"><slot></slot></a>'
        });
        //创建router-view组件
        Vue.component('router-view', {
            render: (h) => {
                const component = this.routeMap[this.data.current];
                return h(component);
            }
        });
    }
    initEvent () {
        window.addEventListener('popstate', () => {
            this.data.current = window.location.pathname;
        });
        window.addEventListener('hashchange', () => {
            let hash = window.location.hash.substr(1);
            this.data.current = hash;
        })
    }
}

export default CustomVueRouter

```
