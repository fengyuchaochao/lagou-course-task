# webpack 插件机制

关于webpack，我们通过之前的介绍已经知道了：
* webpack是一个模块打包工具
* webpack核心之一：loader机制，用于加载资源模块
* webpack核心之一：插件机制，用于解决除了资源模块加载之外，其他所有的自动化构建工作。

常用的插件：
* 自动清除目录插件: clean-webpack-plugin
* 自动生成html插件：html-webpack-plugin
* 拷贝指定文件插件：copy-webpack-plugin

## 自动清除目录插件: clean-webpack-plugin

#### 1. 安装插件
```
npm install clean-webpack-plugin --save-dev
```
#### 2. 修改配置

```
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    plugins: [
        new CleanWebpackPlugin()
    ],
};
```

## 自动生成html插件：html-webpack-plugin

在开始前，我们需要明白使用该插件要解决什么问题？
1. 每次npm run build，需要在dist目录下自动生成一个html文件
2. 自动生成的html文件，需要可以自动引入bundle.js

正是基于以上两个原因，html-webpack-plugin完美的支持了这两个需求。

#### 1. 安装插件
```
npm install html-webpack-plugin --save-dev
```

#### 2. 修改配置

```
const HtmlWebpackPlugin  = require('html-webpack-plugin');

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'webpack simple title',
            meta: {
                viewport: 'width=device-width'
            },
            template: path.join(__dirname, "./index.html")
        }),
    ]
};
```

```
//html模版文件: index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><%= htmlWebpackPlugin.options.title%></title>
</head>
<body>
<h1><%= htmlWebpackPlugin.options.title%></h1>
</body>
</html>
```
说明：
1. filename属性是指定生成的html文件的文件名，默认是index.html
2. title指定标题，
3. meta设置不同的meta配置，生成以后，会自动在html文件添加相应的meta配置
4. template属性用于指定模版html文件，即是基于哪个模版文件生成一个新的html文件。
5. 在html模版文件中可以使用ejs模版语法，通过htmlWebpackPlugin， 引入我们自定义的配置。


## 拷贝指定文件插件：copy-webpack-plugin
在项目中，并不是所有资源都需要webpack进行打包，有的文件，只需要原样copy到dist目录，我们通常把这些文件放到public目录下。

#### 1. 安装插件
```
npm i copy-webpack-plugin --save-dev
```

#### 2. 修改配置

```
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                'public/**'
            ]
        })
    ]
};
```

## 自定义webpack插件

webpack的插件，其实现原理主要就是软件开发中常见的一种思想，钩子机制， 即webpack在执行命令过程中，会经过一系列的流程，而每个流程都提供了相应的钩子，而插件就是利用这些钩子，从而在每个钩子任务被触发时，然后执行插件所提供的某些能力，从而就可以无限去拓展webpack的能力范围。

![image](http://note.youdao.com/yws/res/12999/80A0C7237D12465684DEA83623764EE3)


我们此处自定义一个插件，用于去除bundle.js注释。

```
class MyPlugin {
    apply (compiler) {
        compiler.hooks.emit.tap('MyPlugin', (compilation) => {
            //compilation => 此次打包过程中的上下文
            for (const name in compilation.assets) {
                if (name.endsWith('.js')) {
                    let contents = compilation.assets[name].source(); //获取文件内容
                    const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
                    compilation.assets[name] = {
                        source: () => withoutComments,
                        size: () => withoutComments.length
                    }
                }
            }
        })
    }
}

module.exports = {
    plugins: [
        new MyPlugin()
    ]
};
```

说明：webpack插件一般是一个含有apply方法的类或者对象，插件初始化的时候，会自动执行apply方法，所以插件的内部逻辑，我们一般可以在apply方法内部实现。

