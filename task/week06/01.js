/**
 * 请简述 Vue 首次渲染的过程。
 *
 *  1。 vue初始化，创建实例成员和静态成员
 *  2。 创建vue实例，即new Vue()，然后在构造方法中执行init方法，
 *  3。 在init中调用$mount()方法，将template模版编译成render函数，
 *  4。 调用mountComponent方法，去触发beforeMount，mounted等钩子，返回vue实例对象。
 * */

/**
 * 请简述 Vue 响应式原理。
 *
 *
 * 1. 数据劫持，即通过Object.defineProperty将data数据变成响应式数据，然后采用观察者模式，为每个属性创建Dept实例
 *
 *  每个Dept实例内部的subs属性存储着对应的watcher实例，所谓watcher实例，其实就是哪些地方用到了我们的数据，哪些地方就需要创建watcher实例，
 *
 *  一般有computed watcher， 用户watcher 以及渲染watcher三种， 我们在get方法中可以收集依赖，然后在set方法中调用dept.notify去通知订阅者，
 *
 *  订阅者内部本质上就是调用update方法，update方法本质上就是调用我们传入的callback，从而实现视图更新，或者执行我们指定的操作。
 * */


/**
 *  请简述虚拟 DOM 中 Key 的作用和好处。
 *
 *  key的核心作用还是减少dom更新，当判断节点的key不变的时候，我们就不需要去重新渲染dom。
 *
 * */

/**
 * 请简述 Vue 中模板编译的过程。
 *
 *  所谓模版编译其实就是将模版字符串转换成render函数的过程。
 *
 *  模版字符串 => 生成抽象语法树(parse) => 优化抽象语法树(optimize) => 转换成字符串形式的js代码（generate） => render函数。
 *
 *  1. 首先需要将我们的模版解析，生成抽象语法树，这个过程会伴随着html语法的解析，以及vue中指令，模版等语法的解析。
 *  2. 生成抽象语法树以后，我们可以进一步优化，标记一些静态节点或者静态根节点，从而避免一些重复渲染
 *  3. 将优化后的抽象语法树，通过generate方法转成js代码字符串，最后生成render函数。
 * */
