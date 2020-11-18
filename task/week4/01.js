/**
 *
 * 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

    webpack本质上就是一个模块打包工具，即从入口文件开始，去遍历整个模块依赖树中的每个模块，然后根据模块的文件格式不同，去触发module.rules不同的loader去进行编译转换，
 最后把所有模块都打包到bundle.js中，当然，在构建不同的不同阶段，也会触发相应的插件，去执行指定的相关操作。
*/
/**
 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。
 *
 *  loader 和 plugin  是webapck的核心思想之二，
 *  loader本质上就是一个模块资源转换器，它可以将任何资源模块转换成一个js代码，其实现原理其实就是一个函数，参数是source，即待处理的资源模块，然后转换逻辑就在该方法中实现，最后return转换之后的结果。
 *webpack的插件，其实现原理主要就是软件开发中常见的一种思想，钩子机制， 即webpack在执行命令过程中，会经过一系列的流程，而每个流程都提供了相应的钩子，而插件就是利用这些钩子，从而在每个钩子任务被触发时，然后执行插件所提供的某些能力，从而就可以无限去拓展webpack的能力范围。
 *
 * */


/**
 * 3. 自定义vue脚手架实现思路
 *
 * 实现思路：核心思想主要区别的地方就在于对.vue文件的处理，其他相关构建功能基本保持一致。
 *
 * 1. 创建不同的webpack配置文件，以应对development/production等不同环境的构建需求，同时在scripts配置快捷命令
 * 2. 修改webpack.common.config.js配置: 例如，entry,output,module，以及部分plugin配置
 * 3. 修改webpack.dev.config.js配置： 主要实现实现开启本地服务，自动编译，自动刷新，模块热替换，以及source map等相关功能，
 * 4. 修改webpack.prod.config.js配置：主要是针对生产环境做一些优化，例如定义全局变量，分离js与css文件，压缩js/css文件，以及抽取公共模块等功能
 *
 * 作业地址： https://github.com/fengyuchaochao/fyc-vue-cli
 *
 *
 * */
