/**
 * 1。 当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。
 *
 *  其实就是使用vue内部提供的 $set方法添加新的数据，在$set方法内部会把 新添加的数据，执行defineReactive操作，即为该属性添加get/set方法，使其变成响应式数据。
 * */

/**
 *  2、请简述 Diff 算法的执行过程
 *
 *   首先是对比两个节点是否相同，判断依据是节点的key，sel是否相同，如果不是相同节点，则直接删除原有节点
 *
 *   如果是相同节点，则判断新的vnode是否有text，并且如果和旧的vnode中的text不同，则直接更新text内容。
 *
 *   如果新的vnode有children，判断子节点是否有变化，则使用diff算法对同级元素进行比较。
 *
 *   如果同级元素，节点类型都不一样，则直接删除旧节点，插入新节点，如果节点类型相同，只是节点属性不同，则直接替换原来的节点属性即可。
 * */


/**
 *  模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
 *
 *  作业地址：https://github.com/fengyuchaochao/custom-vue-router
 *
 * */

/**
 *  在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
 *
 *  作业地址：https://github.com/fengyuchaochao/custom-vue
 * */

/**
 * 参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，
 *
 *  作业地址：https://github.com/fengyuchaochao/snabbdom-demo
 * */

/**
 *
 * */
