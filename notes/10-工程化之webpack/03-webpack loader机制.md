# webpack Loader机制

webpack默认情况下，只支持对javascript的打包。

而webpack最大的特点就是一切皆模块，不只javascript,还有html,css，图片，字体等资源，都可以理解为一个模块，webpack借助相应的插件和loader都可以对这些资源模块进行打包加载。

![image](http://note.youdao.com/yws/res/12319/80E57B274DDA4943BD1023E81B37E0FB)

我们需要再次理解这张图的真正含义, 记住二句话：
1. webpack中一切皆模块，不仅仅是js，css，图片等都是资源模块，并且模块之间可以相互引用，js可以通过import引入其他js模块，css模块，引入图片模块，css中也可以引入其他css模块，图片模块等。
2. 从入口文件出发，模块之间的依赖关系可以理解为一个树状的结构（就像上面的图片）树结构中的节点可能是js，也可能是css，也可能是图片，字体等，webpack从入口文件开始打包，遇到js模块则采用自身默认的loader进行打包，遇到css模块，则采用我们配置的css相关loader，遇到图片也类似，最后把所有的模块全部打包一个js文件里。

此时可能会有疑问？难道css也要打包到js中吗？是的，css-loader的作用就是如此，它会把css代码当作字符串，以模块的形式打包到js中。当然，我们也可以通过style-loader将这些css字符串抽取到style标签里。

这里我们要说明一点：大多数的资源模块都是像css-loader那样，将资源模块转换成js代码，打包到bundle.js里，但是还有一些资源模块，例如图片，字体，这些是无法转换成js代码的，


## 常见loader分类

* 编译转换类：例如 css-loader
* 文件操作类：例如 file-loader
* 代码检查类：例如 eslint-loader

说明：
1. 编译转换类：这种加载器其实就是将资源直接转换成js代码，并且放在bundle.js中。
2. 文件操作类：这种加载就是直接将文件拷贝到dist目录下，bundle.js中存放的只是一个文件的引用路径。
3. 代码检查类：这种加载器只是为了对代码的规范，语法等进行检测。

## 加载css

#### 1. 安装相应loader

```
npm install css-loader style-loader --save-dev
```

#### 2. 修改webpack配置

```
const path = require('path');
module.exports = {
    mode: 'none',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [],
};

```
说明：

1. css-loader: 将css代码以字符串的形式打包到bundle.js中。
2. style-loader: 创建style标签，将打包到bundle.js中css单独抽取出来，并且放到style标签中。


注意：

有个细节可能要注意，很多时候会觉得我们在配置文件中配置了css相关loader, 觉得它会自动加载当前目录下的所有css文件，并且进行打包，其实不是这样的，完全不是这样的，

webpack的打包都是从入口文件遍历，然后这个模块依赖的树结构中，除非有css模块，才会触发相应的loader进行打包，并不是我们平时所理解它会指定一个目录，然后直接遍历这个目录下的所有css文件，然后进行打包。

## 加载图片

#### 1. 安装loader

```
npm install file-loader --save-dev
npm install url-loader --save-dev
```

#### 2. 修改webpack配置

```
const path = require('path');
module.exports = {
    mode: 'none',
    entry: './src/index.js'
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: "dist/"
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
               test: /.jpg$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 10 * 1024
                    }
                }
            }
        ]
    },
    plugins: [],
}
```
注意点：
1. file-loader打包图片，并不像css-loader那样，直接将css转换成js代码，而是将图片直接拷贝到dist目录下，bundle.js只需保存对应文件的路径即可。
2. url-loader也可以将我们的图片等资源转换base64，然后以data url的形式，直接放在js代码中。

![image](http://note.youdao.com/yws/res/12383/570D0E1FB09B4CD98A48F40BF5B61B03)
3. publicPath的作用：就是设置图片等资源的引用路径，默认是/。在实际开发过程中，我们可以改成项目所需要的路径。
4. 最佳实践：小文件采用url-loader去进行加载，这样可以减少请求次数，大文件还是需要采用file-loader去单独加载，这样可以提高加载请求速度。

总结：file-loader与url-loader的区别：**file-loader只是将图片等资源拷贝到dist目录下，bundle.js会导出一个文件路径，这样在其他地方就可以使用该路径去加载图片啦，而url-loader可以直接将图片等资源转化成js代码，最佳实践当然还是两者的结合。**

注意点：**url-loader如果设置了limit限制，那么它默认超过limit时就会采用file-loader进行加载，虽然我们的配置中，并没有体现，但使用url-loader时，其实还是需要安装file-loader。**


## 加载javascript

webpack默认只是一个打包工具，其实并不能转换es6+特性，可能有的同学会有疑问？我们的模块依赖不是就用的import/export吗？没错，webpack仅仅是因为模块打包的需求，所以才可以解析es modules, 但是其他es6+新特性并不能转换，

那么，为了兼容更多的浏览器，就需要转换es6+新特性至es5，这就是babel的作用啦。

#### 1. 安装依赖
```
 npm i babel-loader @babel/core @babel/preset-env --save-dev

```
说明：
* babel-loader: 加载器
* @babel/core：babel核心包，一般使用babel的时候，该包是必须安装的
* @babel/preset-env：即babel只是一个转换的平台，其本身并不会转换es新特性，而是借助插件机制去完成新特性的转换，@babel/preset-env就是一种一个插件，它表示可以将目前所有的最新特性都可以转换成es5.

#### 2. 修改webapck配置

```
const path = require('path');
module.exports = {
    mode: 'none',
    entry: './src/index.js'
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: "dist/"
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
               test: /.jpg$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 10 * 1024
                    }
                }
            }
        ]
    },
    plugins: [],
}
```
添加完配置之后，执行打包命令，我们就会发现，我们使用的，比如尖头函数，let/const等新特性都会被转换成es5.


## webpack加载资源的方式

* es modules规范的export和import
* commonjs规范的module.exports和require函数
* amd规范的define函数和require函数

注意：webpack对常用的模块规范都是支持的，在实际开发过程中，我们需要尽量统一使用一种规范，千万不要混用。

除了以上三种常见的方式，还有下面这些情况：

* 样式代码中 @import url('common.css');
* 样式代码中 background: url('./logo.png')
* html代码中图片标签的src属性（可以使用html-loader去加载）

以上这些其实都属于加载资源的方式之一，遇到这些代码的时候，就会触发不同的loader去进行加载。


## webpack核心工作原理

以下这些不同的文件格式，基本都是实际项目开发中一定会遇到的文件：
![image](http://note.youdao.com/yws/res/12497/F5F6C2527AB942F38F3E7E4759C83DD7)

webpack是通过一个**树结构**将这些散落的资源组织并且关联起来，同时一般以其中一个js文件作为入口，去遍历这颗树结构中的资源模块，遇到不同格式的模块，就会采用我们在配置文件中module.rules下不同的loader去加载对应的模块。


![image](http://note.youdao.com/yws/res/12498/A83AB8382239455CA0B3302F62DD011B)

因为，Loader机制是webpack的核心，通过Loader机制才可以实现对不同资源模块的记载。

## 开发一个loader

在开发前，我们需要了解loader的基本工作流程：
1. loader其实就是一个文件转换器，输入就是我们要加载的文件，输出是一段javascript代码字符串，注意必须是javascript，因为所有的资源模块被webpack+loader打包之后，都会放到bundle.js文件里，所以必须保证loader输出的文件是一段javascript。
2. loader支持管道操作，即多个loader同时处理。
3. loader加载资源模块后，是如何打包到bundle.js的？


例如：之前做过的一个中台项目，主要是介绍公司内部各个平台的基本使用手册，所以每个平台对应的详情页面布局又是不一样的，那么这个时候，总不能让开发每个平台都写一种布局，所以在这样一个场景下，我们就可以自定义一个markdown文件的loader，这样平台详情页就可以直接交给相应的产品去写，而我们开发只需要通过这个自定义个markdown-loader去加载md文件，然后把他们显示到html页面中即可。


#### 第一步：自定义markdown-loader

```
//markdown-loader.js
const marked = require("marked"); //借助该包将md文件内容转为html字符串
module.exports = (source) => {
    let html = marked(source);
    return `module.exports = ${JSON.stringify(html)}`;
};
```

#### 第二步：修改webpack配置

```
module.exports = {
    module: {
        rules: [
            {
                {
                    test: /.md$/,
                    use: [
                        'html-loader',
                        './src/loaders/markdown-loader'
                    ]
                }
            }
        ]
    }
};
```

#### 第三步: 引入md文件
```
//index.js
import md from './md/index.md';
document.body.innerHTML = md;
```
我们其实也可以看到bundle.js最终的打包结果：
![image](http://note.youdao.com/yws/res/12540/154D204897834BA58D295442D496A93F)
