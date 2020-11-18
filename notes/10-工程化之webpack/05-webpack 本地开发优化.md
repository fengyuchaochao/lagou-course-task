# webpack开发环境配置

想一下，我们本地开发的场景，其实最需要的就是以下三种功能：

* 开启本地服务
    * 自动编译
    * 浏览器自动刷新
    * HMR 模块热替换
* 提供source map支持，便于调试应用

所以我们本地开发环境，就围绕实现以上几点去搭建。

## 开启本地服务
* 开启本地服务：即通过开启本地服务的方式去访问资源文件。
    * 自动编译：即本地代码变更以后，自动执行webpack命令，进行编译打包
    * 自动刷新：即本地代码变更以后，浏览器自动刷新。
    * HMR: 即模块代码变更以后，不是浏览器整个页面刷新，而是局部模块刷新。

在实际开发中，我们三者都需要支持。

#### 方案一: webpack --watch + browser-sync

1. 首先添加watch属性
```
webpack --watch
```
或者修改配置文件：

```
module.exports = {
    watch: true
};
```
2. 然后安装插件：browser-sync，该插件默认集成了浏览器自动刷新的功能。

采用如下命令，就可以开发一个本地服务：
```
browser-sync dist --files '**/*'
```

说明：采用这种方式虽然可以实现，但是并不是最优方案，原因如下：
1. 首先watch命令是webpack内部的，而browser-sync是一个第三方插件，两者其实没有任何关系。
2. 这种方式，每次文件变化之后，都会自动进行打包编译，也就说dist目录下的文件每次都会自动变化，这也就意味这会执行大量的磁盘写入操作，这是比较浪费资源的。

而下面要说的webpack-dev-server则很好的解决了以上问题。
，
#### 方案2: webpack-dev-server

webpack官方推出了一个开启本地服务插件：webpack-dev-server,它内部默认集成了自动编译，以及自动刷新浏览器等功能。我们既不需要引入第三方插件，也不用使用webpack自带的watch属性。

同时，它最大的好处是：文件变化之后，并不会直接打包编译之后的文件放到dist目录下，而是存在了内存中，这也就避免了频繁的磁盘写入操作，直接操作内存中的数据，速度也更快。

```
//1. 安装webpack-dev-server
npm install webpack-dev-server --save-dev

//2. 修改配置 webpack.dev.conf.js
module.exports = {
    devServer: {
        open: true,
        hot: true,
        contentBase: [
            './public'
        ],
        proxy: {
            '/api' : {
                target: 'https://api.github.com',
                pathRewrite: {
                    '^/api': ''
                },
                changeOrigin: true //用于说明主机名，默认false时表示localhost肯定不会被识别，设置为true,表示主机名就是我们代理的地址：https://api.github.com
            }
        }
    }
};

//3. 执行命令
webpack-dev-server --config webpack.dev.conf.js
```

说明：
* open: true 默认打开一个新的浏览器窗口
* hot: true 该属性为true，即可实现hmr ，即模块热替换
* contentBase: 该属性是用于配置非打包的静态资源的访问路径，默认情况下通过webpack正常打包生成的资源都是可以正常访问的，但是还有一部分资源，不需要webpack进行打包，我们通常把这些文件放到public文件夹下，这是webpack-dev-server可以通过contentBase来指定这些非打包资源文件的访问路径。（其实正常是不用配置的，因为public文件夹下的内容默认也会通过copy-webpack-plugin插件拷贝到dist目录下，但是其实这一步只需要在上下前拷贝一次即可，我们平时开发其实不需要拷贝，那如果不拷贝的话，就需要显式的去指定这些非打包资源的访问路径，所以就用到了contentBase）

注意；我们之前讲到的output下的publicPath是用于指定通过webpack打包的资源文件的访问路径，而devServer下的contentBase是用于指定非打包资源文件的访问路径。前者通常是指定生产环境下资源的访问路径，而后者是我们在本地开发时，可能需要指定。

* proxy用于设置本地代理，来解决开发过程中的跨域问题。

## HMR 模块热替换

上面已经简单介绍了HMR，这里我们还要整体梳理一下HMR的相关知识点。

#### 一. 为什么需要HMR?

很显然，如果没有HMR，每次代码变更，都需要刷新整个浏览器页面，假如页面之前有一些用户的临时输入等操作，刷新以后就无法保留，很显然这是不合理的，所以需要HMR， 每次代码变更以后，只是局部刷新，不需要整个页面刷新。


#### 二. 基本使用

webpack-dev-server内部集成了hot属性，同时结合webpack内置插件HotModuleReplacementPlugin，即可实现模块热替换。

具体配置如下：

```
const webpack = require('webpack');
module.exports = {
    devServer: {
        hot: true,
        //hotOnly: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
```
更新配置以后，我们重启服务，发现了这样一个问题，我们修改样式文件，发现浏览器页面可以实现自动替换，并且不会刷新整个页面，但是修改js文件，为什么就不行了呢？

这是因为：
1. webpack中提供的hmr方案并不是开箱即用，其实需要我们手动去处理模块热替换的逻辑，
2. 为什么样式文件可以开箱即用呢？其实是处理样式文件的style-loader默认实现了模块热替换逻辑。同时由于样式文件修改前后不管发生了什么变化，只需要直接全部替换成最新样式即可，所以可以写成一个公共的逻辑来实现样式文件的模块热替换，但是js代码逻辑很复杂，修改一行代码，并不是简单的直接替换执行就可以啦，所以无法写成一个公共的代码，需要我们自己在代码中单独处理。
![image](http://note.youdao.com/yws/res/12784/3C2D21EFFDB8480A9E3B22D9EA97CC63)
```
//自己处理模块热替换的相关逻
module.hot.accept('./header', () => {
    console.log('header 更新');
    console.log(name);
});

module.hot.accept('./images/kobe.jpg', (src) => {
    image.src = src;
});
```
3. 现代教授架，例如vue-cli, create-react-app等默认都是支持HMR 因为这些脚手架都已经明确规定了每个文件的格式，这样就可以实现一个公共的模块热替换方案。
4. 注意点：实际开发中，我们推荐使用hotOnly: true,而不是hot：true，因为hot:true这种配置，当模块热替换的相关处理逻辑报错的时候，就会回退到自动刷新浏览器，同时模块热替换的报错信息也看不到啦。

## source map


#### 一. 解决了什么问题？
顾名思义：源代码映射，

![image](http://note.youdao.com/yws/res/12680/B147C069BAEF42CDA9940F3C9174A25D)

![image](http://note.youdao.com/yws/res/12682/4C7E2F15781147088FD687769433CEA1)

我们平时本地所写的代码，打包编译或者压缩之后，会完全生成一份我们不认识的代码，也就是说其实本地代码和线上代码是不一致的，那么，如果线上代码报错了，就很难定位到问题到底是在哪里，所以source map解决的就是这个问题，通过source map可以对打包之后的代码和本地代码做一层映射，这样能够帮助我们更好的调试在线代码。

#### 二. 基本使用

例如如下：index.js是我们的入口文件，并且有个错误
![image](http://note.youdao.com/yws/res/12697/1CC3F2A88F684DF9A77C56C5EDED9553)

我们首先看一下，如果没有开启source-map，浏览器的报错信息是什么？
![image](http://note.youdao.com/yws/res/12701/624952B2C644480098B361C87192B8EC)
从上图可以看到，只是告诉了我们bundle.js里报错啦，但是bundle.js是打包之后的文件呀，和我们本地代码完全不一样，提示这样一个错误，我们也很难直接定位到是我们本地代码的哪个文件，哪一行报错了。

那我们开启source-map再看看效果，开启方式如下：
```
module.exports = {
    devtool: 'source-map'
};
```
然后重新打包，在浏览器发现，此时报错就比较清晰了。
![image](http://note.youdao.com/yws/res/12710/ABAE2F3636864808942B4468AE6BB806)

这就是source-map的作用，用来帮我们更方便快速的调试线上代码，同时，devtool其实有很多种模式，source-map只是其中一种，不同的模式，各有特点，我们加下来就具体看一下。

#### 三. devtool模式对比

以下就是devtool的所有模式：

![image](http://note.youdao.com/yws/res/12692/69DB0BBBF50C456EAB286F4970D924D6)


1. 我们首先来看一下eval模式

看到eval，我们可能只知道它可以用来执行js代码，我们在浏览器端看看效果：

![image](http://note.youdao.com/yws/res/12720/3E88200FF0ED44FE9FC98F4726D2CBCE)

可以看到eval执行代码，从右侧可以看到，默认其实是将代码放到了一个虚拟机中，其实，eval可以通过sourceURL去指定其代码运行的文件路径，效果如下：

![image](http://note.youdao.com/yws/res/12723/4387877E866C4B2E9CF76EA44E3E9279)

而devtool采用eval模式，其本质上也是将我们的资源文件中的代码放到eval中进行执行，同时采用sourceURL去指定代码所有的路径文件，从而我们在浏览器端调试的时候，就可以看到错误代码所在的文件路径了。

这就是eval模式的特点，不会额外生成新的.js.map文件，但是它仅仅可以告诉我们错误发生的文件路径是什么，同时这种模式速度会更快。

2. 我们来说说几个关键特点：

* eval： 是否使用eval执行模块代码，可以告诉我们哪个文件报错
* cheap: 顾名思义，阉割版的，即速度可能更快，但功能相对较少
* module:表示是否能到得到loader处理之前的源代码。

上面图中的各种模式，基本都是利用这几个关键特点，相互结合形成的模式， 

那最佳推荐是什么呢？
* 开发环境：cheap-module-eval-source-map，即我们希望看到loader处理之前的源代码，所以一定要加module特性，同时再结合cheap和eval速度会更快。
* 生产环境：生产环境其实不建议使用任何模式，因为我们消炎药尽量在开发环境就要调试好所有代码，线上环境尽量不要出错，但是如果非要使用，则使用nosources-source-map, 表示如果报错，会告诉我们是哪个文件报错，但是.map映射文件并不会被打包到dist目录中，也就是说线上环境一定不能让别人看到我们的源代码。
