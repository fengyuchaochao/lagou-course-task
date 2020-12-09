# 封装vue.js组件库


## 搭建组件库常用api

* $root
* $parent/$children
* $ref
* provide/inject：默认并不是响应式数据，也禁止修改inject注入的数据，如果希望provide响应式数据，可以直接provide当前实例对象。
* $attrs/$listeners

这里重点说一下：$attrs/$listeners

这两个属性我们平时可能用的不多，但其实在封装组件的时候，会经常用到

* $attrs: 以前父组件想要传递给子组件数据，通常是在自组件内部自定义prop来传递，但其实我们也可以直接使用$attrs获取，这样就不需要我们每次都定义props了

```
//parent.vue

<template>
    <child  class="a" placeholder="input..." required></child>
</template>

//child.vue
<template>
</template>
<script>
export default {
    props: {
        placeholder: {
            required: true,
            default: ''
        },
        required: {
            required: false,
            default: false
        }
    }
}
</script>
```

默认情况下，child组件绑定的属性默认都会添加到child组件的根节点上，即.child-wrapper， 如果我们想要将这些属性绑定到指定的组件上，我们可以：
1. inheritAttrs: false //禁止默认绑定到根组件
2. 在指定的组件中使用v-bind="$attrs"绑定。
```
//parent.vue

<template>
    <child  class="a" placeholder="input..." required></child>
</template>

//child.vue
<template>
    <div class="child-wrapper">
        <input v-bind="$attrs"/>
    </div>
</template>
<script>
export default {
    inheritAttrs: false
}
</script>
```

$listeners也类似的用法。


## 搭建组件库工作流

* Monorepo：在一个项目中管理多个包
* storybook：可以快速预览组件效果
* jest: 单元测试
* rollup：在第三方库开发时通常用rollup进行打包
* lerna：主要用于管理具有多个包的javascript项目，可以快速将每一个包发布到npm。


常见其他第三方库：
* rimraf: 清除指定目录
* plop: 快速基于指定模版去生成指定文件结构

#### MonoRepo

参考文档：https://segmentfault.com/a/1190000019309820?utm_source=tag-newest


> 拓展：yarn workspace, Monorepo通常会搭配yarn workspace一起使用，因为monorepo的packages中每个组件的依赖可能有相同的，也有可能有不同的，这个时候就需要我们公共的依赖只安装一次即可，而独有的则只在指定的组件下面安装，这就是yarn workspace的作用，npm没有该功能。
