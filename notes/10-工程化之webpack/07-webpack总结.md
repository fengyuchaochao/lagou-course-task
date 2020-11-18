# webpack总结

## 总结
通过学习了这么多webpack相关知识，其实总结下来就是以下几点：

1. webpack是一款模块打包工具
2. 采用loader机制去加载不同的资源模块
3. 采用插件机制去拓展webpack的功能

基于以上三点理论只是，同时集合实际应用场景，我们又针对开发环境和生产环境分别作了对应的介绍：

 开发环境：
 1. 开启本地服务
 2. 自动编译
 3. 自动刷新浏览器
 4. HMR 模块热替换
 5. source map
 
生产环境：
1. 定义全局变量
2. 去除无用代码
3. 代码分割
4. 代码压缩
5. 提供公共代码

以上基本就是webpack常用的一些场景啦。


## 实战

自定义vue项目脚手架，实现对vue项目的本地构建以及打包。

整体项目架构如下：
1. 首先新建不同webpack配置文件，来分别配置开发环境，生产环境不同的配置，同时在scripts配置相应的命令。
2. 明确基础webpack配置
3. 明确开发环境webpack配置
4. 明确生产环境webpack配置


#### 一. 安装webpack以及创建相关配置文件
    
```
 npm i webpack webpack-cli --save-dev
```


#### 二. 明确webpack.common.js

* entry
* output
* 相关loader
    * label-loader以及相关依赖
    * css-loader,less-loader,style-loader
    * url-loader,file-loade
    * vue-loader
* 相关插件：
    * html打包插件：html-webpack-plugin

#### 三. 明确webpack.dev.js

* 开启本地服务：webpack-dev-server
* 

#### 四. 明确webpack.prod.js

* 自动清除文件：clean-webpack-plugin
* copy文件插件：copy-webpack-plugin
* 各种优化插件及配置。
