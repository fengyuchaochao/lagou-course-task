# Composition API


## 钩子函数

![image](http://note.youdao.com/yws/res/14619/626148FEB3474FFB92318B9FE95C4B54)


例如：我们实现一个鼠标移动，更新坐标位置的案例：
```
import {reactive, onMounted, onUnmounted} from 'vue';
//把鼠标移动相关的逻辑封装到一个函数中，
function useMousePosition () {
    const position = reactive({
        x: 0,
        y: 0,
    });
    const update = e => {
        position.x = e.pageX;
        position.y = e.pageY;
    };
    onMounted(() => {
        window.addEventListener('mousemove', update);
    });
    onUnmounted(() => {
        window.removeEventListener('mousemove', update)
    });
    return position;
}
export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    setup (props, context) {
        let position = useMousePosition();
        return {
            position
        }
    },
    mounted () {
    }
}
```
注意点：
1. setup的执行时机是在beforeCreate和created之间执行。

## 响应式函数

* reactive
* toRefs
* ref

1. reactive可以将一个对象变成响应式数据，本质上返回的就是一个proxy对象，但是reactive返回的对象不能通过解构去使用，否则响应式就失效了。
2. 针对reactive的弊端，我们可以使用toRefs将对象中的每个属性都设置为响应式数据，然后就可以解构该对象啦，并且响应式不会失效。
```
function useMousePosition () {
    const position = reactive({
        x: 0,
        y: 0,
    });
    const update = e => {
        position.x = e.pageX;
        position.y = e.pageY;
    };
    onMounted(() => {
        window.addEventListener('mousemove', update);
    });
    onUnmounted(() => {
        window.removeEventListener('mousemove', update)
    });
    return toRefs(position);
}
export default {
    setup () {
        return {
            ...useMousePosition()
        }
    },
}

```
3. ref可以将一个普通类型数据变成一个响应式数据。
```
function increaseNumber () {
    let count = ref(0);
    const increase = () => {
        count.value++;
    };
    return {
        count,
        increase
    };
}
export default {
    setup () {
        return {
            ...increaseNumber()
        }
    },
}
```

## computed/watch/watchEffect

* computed()
* watch()
* watchEffect()

#### 一. computed()

```
function increaseNumber () {
    let count = ref(0);
    let count2 = computed(() => {
        return '科比：' + count.value;
    });
    const increase = () => {
        count.value++;
    };
    return {
        count,
        count2,
        increase,
    };
}
```

#### 二. watch()

```
function increaseNumber () {
    let count = ref(0);
    //watch监听count
    watch(count, (newVal, oldVal) => {
        console.log(newVal);
        console.log(oldVal);
    });
    const increase = () => {
        count.value++;
    };
    return {
        count,
        count2,
        increase,
    };
}
```

#### 三. watchEffect()

watchEffect其实就是watch的简化版，同时该函数返回一个函数，调用该返回的函数，可以停止监听。
```
function increaseNumber () {
    let count = ref(0);
    const stop = watchEffect(() => {
      console.log(count.value);
    });
    const increase = () => {
        count.value++;
    };
    return {
        count,
        increase,
        stop
    };
}
```

