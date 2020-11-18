# webpack生产环境优化

* 不同环境下采用不同的配置
* 定义全局变量： DefinePlugin
* 去除无用代码：Tree Shaking
* 模块合并
* js代码分割
    * 提取公共模块
    * 动态导入与魔法注释
* css代码分离


## 不同环境下采用不同的配置

* 根据环境不同，导出不同的配置

```
//动态导出不同的配置
module.exports = (env, argv) => {
    let webpackConfig = {};
    if (env === 'production') {
        webpackConfig.mode = 'production';
        webpackConfig.devServer = {};
    }
    if (env === 'development') {
        webpackConfig.env = 'development';
    }
    return webpackConfig；
};

//执行命令
webpack --env development;
webpack --env production;
```
* 创建不同的配置文件，
```
//webpack.config.base.js

//webpack.config.dev.js

//webpack.config.prod.js

//执行打包命令，走prod配置
webpack --config webpack.config.prod.js

//开启本地服务，走dev配置
webapck-dev-server --config webpack.config.dev.js
```

## 定义全局变量： DefinePlugin

```
const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            API_BASE_URL: '"https://api.example.com/health"',
            BASE_CONFIG: JSON.stringify({
                name: 'kobe',
                age: 41
            })
        })
    ]
};

//然后我们在其他模块文件中，就可以直接使用这两个值：
console.log(API_BASE_URL);
console.log(BASE_CONFIG)
```

注意：使用DefinePlugin定义的全局变量，它的值其实是一个代码片段，这也是API_BASE_URL的值使用了双重引号，BASE_CONFIG使用了JSON.stringify()。

## 去除无用代码：Tree Shaking

Tree Shaking： 顾名思义，摇树，可以想象我们平时摇树，那些枯树叶都被摇下来的场景， 本质上就是去除无用代码的含义，即平时项目中没有用到的代码在打包的时候，都不会被打包进来，从而优化打包之后的文件体积。

在production模式下，Tree Shaking是默认开启的，也不需要我们做一些额外的配置，但是在非production模式下，就需要我们手动去配置来实现去除无用代码的功能。

```
module.exports = {
    mode: 'none',
    optimization: {
        usedExports: true, //表示只导出外部使用了的代码
        minimize: true,//压缩代码
    },
};
```
说明：
* optimization属性就是用来集中去配置webpack内部自带的一些优化功能。
* usedExports 表示只导出外部使用了的代码，不使用的代码依然会被导出，但是会被标识出来。
* minimize 即压缩代码，它会把usedExport标识出来的无用代码去除，两者配置就可以实现tree shaking的功能。

## 模块合并

```
module.exports = {
    optimization: {
        concatenateModules: true   
    }
};
```
* concatenateModules: 该属性的作用是尽可能将所有的模块合并，并且输出到一个函数里，因为默认情况下，每个模块都会被单独输出到一个函数里，所以这种方式不仅仅可以减少代码的体积，还可以提高代码的运行效率。 这种机制又叫Scope Hoisting, 即作用域提升。


## 代码分割

在介绍webpack最开始时，我们就说到webpack就是将散落的模块全部打包到一个bundle.js里，但是随着项目越来越复杂，所有模块全部都打包到bundle.js里，带来的问题就是，bundle.js体积太大了，

与此同时，带来的问题就是首页加载速度过慢，但其实很多模块并一定非要在首页渲染时就加载，所以，这里我们才提出了**代码分割**的思想，其实就是将bundle.js拆分成多个js文件。

代码分割主要有两种思路：
1. 多入口打包
2. 动态引入与魔法注释

#### 多入口打包

多入口打包，通常是在多页面应用时会用到，即一个页面对应一个入口。

```
const HtmlWebpackPlugin  = require('html-webpack-plugin');
module.exports = {
    entry: {
        index: './src/index.js',
        about: './src/about.js'
    },
    output: {
        filename: '[name].bundle.js''
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '首页',
            template: './src/index.html',
            filname: 'index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            title: '关于我们',
            template: './src/about.html',
            filname: 'about.html',
            chunks: ['about']
        })
    ]
};
```
实现多页面应用，以及多入口打包通常需要以下几点：
1. entry设置多入口文件
2. 使用HtmlWebpackPlugin插件实现多页面应用
3. HtmlWebpackPlugin使用chunks属性可以关联到对应的bundle.js文件

同时，面对多页面应用随之而来的一个问题就是，如何提取公共模块？因为多个页面之前肯定有公共的模块文件，配置方法也很多简单

```
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all' //表示把所有的公共模块都提取到单独的bundle文件当中
        }
    }
};
```

#### 动态导入与魔法注释

即通过import()函数去动态引入需要的模块，同时该模块返回的是一个promise。

```
import(/* webpackChunkName: 'utils' */'./utils.js').then((utils) => {
    utils.show();
})
```

那在实际vue或者react项目中，我们通常是在路由文件中去动态引入相应的组件。


## css代码分离

之前我们介绍的都是javascript模块代码如何分离到单独的文件中，这里我们再介绍一下css代码如何分离到单独的文件中。

```
//安装插件
 npm i mini-css-extract-plugin --save-dev
 
//修改配置
module.exports = {
    module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin()
    ]
}

```

说明：默认情况下style-loader是将css代码放到了style标签里，但此时css代码还是在bundle.js文件里，而使用mini-css-extract-plugin可以将css文件抽离成单独的css文件，并且在bundle.js里通过link标签去引入css文件。

## 压缩文件

默认情况下，webpack内置的压缩插件，只对js文件进行压缩，所有其他额外引入的资源文件，如需进行压缩，需要自己实现。

例如，我们上一节把css样式单独分离成一个css文件了，这时，就需要我们手动对其进行压缩。

```
//压缩css
npm i optimize-css-assets-webpack-plugin --save-dev
//压缩js
npm i terser-webpack-plugin --save-dev

const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    optimization: {
        minimizer: [
            new TerserWebpackPlugin(),
            new OptimizeCssAssetsWebpackPlugin()
        ]
    }
};
```
说明：
1. webpack默认会对js文件进行压缩，其他文件如需压缩，需要单独配置。
2. 上面的代码，我们是将插件配置到了minimizer属性中，主要是为了方便集中管理压缩相关的插件，当然配置到plugins中也是可以的。
3. minimizer配置了自定义的插件之后，其默认的压缩js插件就失效了，因为相当于是重写了minimizer属性，所以还需要我们额外再添加压缩js的插件。


## 输出文件名 Hash

之所以对输出文件名添加hash值，主要还是出于浏览器端缓存策略，我们也要尽可能的利用缓存，避免重复的服务器端请求。

首先想象，如果没有hash值的时候，我们怎么设置缓存？可能我们只是为指定的文件设置一个缓存失效的时间，至于时间的长短可能不太好明确，如果时间长了，假如服务器端已经更新了，还是走的缓存，这样也不对，但是时间设置短了，缓存的意义也就很小了，

所以，假如我们能够根据文件的内容，去动态的修改文件名，这样我们在浏览器端就就可以把缓存时间设置的长一点，同时只要文件内容有变化，其文件名就自动变了，这时相当于一个新的请求了，不会走缓存。从而即可以实时获取到最新的内容，也可以保证尽可能的走缓存策略。

```
module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[contentHash:8].bundle.js'
    }
};
```
* hash
* chunkHash
* contentHash

1. hash是项目级别的，即项目中任意一个文件有修改，其打包之后的文件的hash值都会改变，并且打包之后所有文件的hash都是一样的，
2. chunkHash是chunk级别的，一般不同的入口文件对应不同的chunk，同时import动态导入的文件也相当于一个新的chunk，那么假如某一个文件发生改变，只有该文件所属的chunk的chunkHash才会发生改变，其他chunk的chunkHash值不会变化。
3. contentHash是文件级别的，即只要文件发生改变，那么它的contentHash就会发生变化。

在实际开发中，我们推荐使用contentHash来定义输出文件的名字，同时也可以指定hash值的长度。


