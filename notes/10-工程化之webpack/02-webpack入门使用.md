
# webpack入门使用

目录结构如下：

![image](http://note.youdao.com/yws/res/12262/C90651DBDE544AF980065E4B2F1BA9CE)

### 1. 安装webpack

```
npm install webpack webpack-cli --save-dev
```

### 2. 执行webpack命令
```
npx webpack;
```

注意点：

1. **webpack默认入口文件是./src/index, 执行webpack命令之后，默认生成dist/main.js**

![image](http://note.youdao.com/yws/res/12266/612138CE784D48C6BB55A55240FFE059)

2. **webpack自身只支持打包js文件，html,css等其他文件，需要借助插件和loader完成工程**

### 3. 自定义配置文件

执行webpack命令，在实际开发过程中，一般需要我们自己去自定义配置文件。

```
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js', //如果是相对路径，前面的./不能省略
    output: {
        filename: 'bundle.js', //也可以是一个路径+文件名
        path: path.join(__dirname, 'output') //path属性必须是绝对路径，所以可以记住node中path.join(__dirname, '')去实现
    }
};
```

webpack默认会执行webpack.config.js文件，如果需要指定其他配置文件，也可以采用：

```
webpack --config webpack.dev.conf.js
webpack --config webpack.prod.conf.js
```

再次强调几点：

1. mode: production（默认）/development/none, production模式下，webpack会自动进行一些压缩等优化操作，development模式下，会自动加快狗加速度，以及方便调试等相关特性，none模式就是webpack最原始的打包效果。
2. entry：入口文件即可以是相对路径，也可以是绝对路径，如果是相对路径，前面的./不能省略。
3. output中的path属性必须是绝对路径，通过可以借助node中的path模块生成绝对路径。


## webpack打包结果运行原理

webpack打包本质上就是将多个相互依赖的模块，打包到一个文件里，那打包到一个文件里，如何避免相互影响呢？答案当然就是函数，每个模块的代码都被定义在一个函数私有作用域里，同时模块之间的依赖关系，也可以通过函数之间的调用传参等连接起来。


其实后来想想，也不要把构建打包这些概念想复杂化了，本质上不还是一段js代码嘛，每个模块被打包之后，其实就是将这个模块的代码放在了一个单独的函数里去执行，模块之前的依赖关系，也可以通过函数的相关调用，传参体现出来。


