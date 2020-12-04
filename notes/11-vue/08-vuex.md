# Vuex状态管理

## 组件间数据传递方式

我们常见的方式主要有以下三种：

1. 父组件给子组件传递数据 - props
2. 子组件给父组件传递数据 - $emit触发自定义事件
3. 不相关组件传递数据 - eventbus
4. 多个组件使用公共数据 - vuex

拓展：eventbus的实现机制就是我们常说的发布订阅者模式，eventbus维护的公共vue实例就是其中的事件中心。

除此之外，还可以通过一下方式：

1. $root
2. $parent
3. $children
4. $ref

但是以上四种方式不推荐在项目中大量使用，一般是在自定义组件中，或者简单项目中可以使用这些方式。


## Vuex

Vuex是专门为vue.js设计的状态管理库。

Vuex中的核心概念：

* Store
* State
* Getter
* Mutation
* Action
* Module

#### 常见vuex实例，并且注入到vue实例中

```
//store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

//main.js
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
```
将store注入到vue实例以后，就可以在vue实例中使用this.$store访问store中的数据啦。

#### State使用

这里，我们主要讲一下如何获取state？

```
//定义state
export default new Vuex.Store({
  state: {
    count: 20,
    msg: 'hello kobe'
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

```
```
//获取state方式1:
export default {
    mounted () {
        console.log(this.$store.state.count;);
        console.log(this.$store.state.msg;);
    }
}
```
采用方式1是最原始的方式，但是需要我们每次都重复写this.$store.state， 所以vuex使用mapState做了一层封装，效果如下：
```
//获取state方式2
import {mapState} from 'vuex';
export default {
    computed: {
        ...mapState(['count', 'msg'])
    },
    mounted () {
        console.log(this.count);
        console.log(this.msg);
    }
}
```
采用mapState，很显然简化了我们的写法，也是推荐使用的方式，但是要注意：data中的属性不能与之重名。

同时，我们也可以设置别名：
```
//获取state方式3
import {mapState} from 'vuex';
export default {
    computed: {
        ...mapState({
            num: 'count',
            message: 'msg'
        })
    },
    mounted () {
        console.log(this.num);
        console.log(this.message);
    }
}
```
#### Getter使用

```
//定义getters
export default new Vuex.Store({
  state: {
    count: 20,
    msg: 'hello kobe'
  },
  getters: {
    reverseMsg (state) {
      return state.msg.split('').reverse().join('');
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
```
```
//获取getters

//方式1
export default {
    mounted () {
        console.log(this.$store.getters.reverseMsg);
    }
}
//方式2
import {mapGetters} from 'vuex';
export default {
    computed: {
        ...mapGetters(['reverseMsg'])
    },
    mounted () {
        console.log(this.reverseMsg);
    }
}
```
当然也可以传入一个对象设置别名，这里就不显示啦

#### Mutation使用
我们在Mutation一般可以定义指定的函数，去同步的修改state。

```
//定义mutations操作
export default new Vuex.Store({
  state: {
    count: 20,
    msg: 'hello kobe'
  },
  mutations: {
    increate (state, payload) {
      state.count += payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
```
```
//调用mutations

//方式1
export default {
    methods: {
        add () {
            this.$store.commit('increate', 1);
        }
    }
}

//方式2
import {mapMutations} from 'vuex';
export default {
    methods: {
        ...mapMutations(['increate']),
        add () {
            this.increate(1);
        }
    }
}
```
总结：和state，getters一样，我们既可以通过原始的$store.commit去调用，也可以引入mapMutation去做一层映射，这样就不用重复书写
$store.commit啦。

#### Action使用

mutation中只能定义同步操作，如果想实现异步操作，那必须定义在actions中，同时如果需要在actions中修改state，则需要再调用mutations来修改，不能直接修改state.

```
//定义actios
export default new Vuex.Store({
  state: {
    count: 20,
    msg: 'hello kobe'
  },
  mutations: {
    increate (state, payload) {
      state.count += payload;
    }
  },
  actions: {
    increateAsync (context, payload) {
      setTimeout(() => {
        context.commit('increate', payload)
      }, 3000)
    }
  },
  modules: {
  }
})
```

```
//获取actions

//方式1
export default {
    methods: {
        addAsync () {
            this.$store.dispatch('increateAsync', 3);
        }
    }
}

//方式2

import {mapActions} from 'vuex';
export default {
    methods: {
        ...mapActions(['increateAsync']),
        addAsync () {
            this.increateAsync(3);
        }
    }
}
```

#### Module使用

当state状态越来越多时，我们就可以将其分成不同的模块来管理，每个模块都有自己的state，getters,mutation,actions，最后把这些模块注入到modules选项即可。

例如：此处我们有一个专门购物车的模块。

```
//car.js

let state = {
    products: []
};
let getters = {};
let mutations = {
    addProduct (state, product) {
        state.products.push(product);
    }
};
let actions = {};

export default {
    namespaced: true, //一般都要把命名空间加上，这样更清晰的表明是从哪个模块取的数据。
    state,
    getters,
    mutations,
    actions
}

```

```
//将单独的模块 注入到store中
export default new Vuex.Store({
    modules: {
        car
    }
})
```

接下来我们就来看看如何获取和操作模块中的数据和方法：

```
//方式1: 采用原始方法

export default {
    mounted () {
        //获取car模块中的数据
        this.$store.state.car.products;
        //调用car模块中的mutations
        this.$store.commit('car/addProduct', '汽车')
    }
};
```
```
//方式2: 采用map系列

export default {
    computed: {
        ...mapState('car', ['products']),
    },
    methods: {
        ...mapMutations('car', ['addProduct']),
    },
    mounted () {
        //获取car模块中的数据
        console.log(this.products);
        //调用car模块中的mutations
        this.addProduct('衣服');
    }
}
```

#### vuex插件

```
//自定义插件
const myPlugin = store => {
  store.subscribe((mutation, state) => {
    localStorage.setItem('data', state);
  })
};

//注册插件
export default new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {},
    plugins: [myPlugin]
})

```
vuex的插件比较简单，就是一个参数是store的函数，注入插件以后，插件内部的逻辑会在mutations之后自动执行。

典型的应用场景就是：当我们需要把state的数据存储在本地的时候，由于mutations中定义了很多修改state的函数，难道我们要在每一个函数内部都调用localStorage.setItem去存储最新的值吗？很显然这样实现不太友好，最优方案就是把这部分逻辑放到插件中，因为插件指定的函数会在mutations方法执行之后，自动调用。



#### 总结

关于vuex，首先我们要记住它的几个核心元素：

* store: 即状态管理仓库，它的内部包含以下这些属性
* state：即状态，即我们要存储的数据
* getters：state与getters类似于vue实例中data与computed的关系
* mutations：只能定义同步操作方法，用于修改state。
* actions：可以定义异步操作方法，无法直接修改state，需要调用mutations去修改state
* modules：即定义多个模块，应对state较多较复杂的场景。

初次之外，我们要知道这些属性或者方法，可以通过最原始的方法去获取，也可以通过map系列更友好的方式去调用。

原始方法：

* this.$store.state.count
* this.$store.getters.count
* this.$store.commit('increate', 2);
* this.$store.dispatch('increateAsync', 2)

其对应的map系列：

* mapState
* mapGetters
* mapMutations
* mapActions


最后，我们还有一点需要注意：

<b>
我们之前一直提到要通过mutations定义的方法去修改state，不要直接修改state，这是因为通过mutations修改state时，我们可以在vue调试工具中监控到所有历史修改即可，但是直接修改state是无法追踪到的。

另外，vuex默认是非严格模式，在非严格模式下，我们直接修改state其实也是可以生效的，只不过在vue调试工具中没有历史记录，但是在严格模块下，直接修改state是不允许的，被报错提醒。

一般我们都最好采用mutations去修改state，尽量避免直接修改state.
</b>

## 模拟vuex

#### 实现思路

1. 首先我们通过vuex的使用，可以知道，vuex内部有两个属性，一个是Store类，一个是install方法。
2. install方法主要是作为vue插件使用的固定范式，同时通过store属性注入到vue实例中，这样vue实例中就可以通过this.$store访问啦。
3. 核心实现就是Store类了，主要包含state,getters,mutations,actions等属性，同时还有commit,dispatch等方法。

以上就是整体实现思路，接下来我们首先来看一下开发一个vue插件的必备范式，vuex，vue-router等都是采用这个思路：

```
//myvuex.js
let _Vue = null;
class Store {
    
}
function install (vue) {
    _Vue = vue;
    _Vue.mixin({
        beforeCreate () {
            if (this.$options.store) {
                _Vue.prototype.$store = this.$options.store;
            }
        }
    })
}
```
以上基本是一个固定的基本套路，首先创建一个uex实例，准确说是store实例，然后将该实例等都是通过store属性注入到vue实例中，然后我们就可以在vue实例中使用$store获取该实例中的数据和方法了。

为什么这样就可以了呢？其实是插件的install内部使用了Vue.mixin，然后在beforeCreate中我们就可以获取到传入的store属性对应的值，并且把该值赋值给vue原型对象的$store属性，这样我们就可以在vue实例中访问啦。


最后说一下Store类，思路比较简单，创建state,getters,mutations,actions等属性，同时还有commit和dispatch方法，有几点需要注意：
1. 首先要使用vue提供的observable将state变成响应式数据，
2. commit内部其实就是调用了mutations指定type的方法。
3. displatch内部其实就是调用了actions指定type的方法。


#### 完整代码
```
let _Vue = null;
class Store {
    constructor (options) {
        const {
            state = {},
            getters = {},
            mutations = {},
            actions = {}
        } = options;
        this.state = _Vue.observable(state);
        this.getters = Object.create(null);
        Object.keys(getters).forEach(key => {
            Object.defineProperty(this.getters, key, {
                get: () => getters[key](state)
            })
        });

        this._mutations = mutations;
        this._actions = actions;
    }
    commit (type, payload) {
        this._mutations[type](this.state, payload);
    }
    dispatch (type, payload) {
        this._actions[type](this, payload);
    }
}

function install (Vue) {
    _Vue = Vue;
    _Vue.mixin({
        beforeCreate () {
            if (this.$options.store) {
                _Vue.prototype.$store = this.$options.store;
            }
        }
    })
}

export default {
    Store,
    install
}

```
