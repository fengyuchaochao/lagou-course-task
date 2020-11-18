# EsLint

Eslint是最为主流的javascript lint工具。

Eslint通常有以下几种作用：
* 语法错误检测
* 代码样式风格检测

所以说，eslint并不仅仅是一个代码风格的约定工具，它同时也可以帮助我们发现语法错误，以及潜在的代码问题。

## 快速上手

#### 第一步：初始化项目
```
mkdir eslint-demo
cd eslint-demo
npm init
```

#### 第二步：安装eslint
```
npm install eslint --save-dev
```
安装完成以后,查看eslint的版本

```
//方法1
./node_modules/.bin/eslint --version //v7.12.1

//方法2
npx eslint --version //v7.12.1
```
注意：npm 从5.2版开始，增加了 npx 命令，它最典型的一个作用就是：它会自动查找node_modules下的命令是否存在，不需要我们手动切到/node_modules/.bin下执行。

具体详情也可以参考：<a href="http://www.ruanyifeng.com/blog/2019/02/npx.html">阮一峰-npx使用教程</a>

#### 第三步：添加配置文件

eslint在执行的时候，会默认查找.eslintrc.js文件，所以我们需要先创建该文件，创建方式是执行eslint --init命令即可

```
npx eslint --init
```
执行完成以后，就创建了.eslintrc.js文件

```
//.eslintrc.js

module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard" 
    ],
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
    }
};

```

#### 第四步：执行eslint命令

```
npx eslint index.js //即判断index.js文件的代码规范
```

## Eslint配置文件解析

```
//.eslintrc.js
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard" //该风格内部也集成了window，document等全局对象
    ],
    "parserOptions": {
        "ecmaVersion": 12 //
    },
    "rules": {
        "no-alert": "off"
    },
    "globals": {
        "jQuery": 'readonly'
    }
};

```

* env: 该属性表示当前代码可以运行的环境，例如browser为true,就表示当前代码可以运行在浏览器环境中，即代码中可以使用浏览器提供的window,document等全局对象。

以下是env属性的常见属性：
![image](http://note.youdao.com/yws/res/12079/3169B818B9534584A23E9F58AA617F96)

* **extends**: 用于设计当前配置所继承的公共配置，一般一些通用配置我们都可以单独提取出来，例如此处的standard，就是当前流行通用的一些公共配置，还有针对vue等公共配置，然后我们在当前项目中可以用extends去继承这些公共配置。
* **parserOptions**: 即语法解析器的相关配置，例如ecmaVersion，我们此处设置的是12，也就是说我们在代码中可以使用包含es12在内的所有新特性，假如我们设置为5，那么es6+的所有新特性将无法在代码中使用。
* **rules**：即配置具体的规则，每个规则对应的值一般有三种：off/warn/error，off表示关闭该规则检测，warn表示只是警告，error则提示报错。
* **globals**：主要是用来额外配置一些全局对象。


## Eslint配置注释

即在我们的项目中，eslint是针对整个全局代码进行的配置，但是在实际开发过程中，难免会出现一些局部代码，可能不需要进行eslint检测，这个时候，我们总不能直接把全局的eslint检测关掉，这就是Eslint配置注释的作用。


例如：
```
const str1 = '${name} is a actor';
```
该行代码如何在正常eslint环境中运行时，会报错，因为普通字符串中不允许出现${}符号，这时，会提示以下错误：**no-template-curly-in-string**

但是，在某些情况下，我们可能需要上面的这种写法，这时我们就可以当前这一行添加eslint配置注释，表示当前这一行不需要进行eslint规则检测。
```
const str1 = '${name} is a actor'; //eslint-disable-line no-template-curly-in-string
```

* eslint-disable-line：可以说明当前这一行不需要进行eslint规则检测, 它后面也可以跟一个具体的规则，表示这一行的某个规则不需要检测。


## Eslint与Typescript

之前可能大家推荐使用Tslint去检测Typescript，但是后来Tslint已经停止维护啦，并且推荐我们使用eslint以及@typescript-eslint插件去进行检测，


@typescript-eslint插件的安装只需要我们在初始化.eslintrc.js时，选择上typescript这一项即可。
![image](http://note.youdao.com/yws/res/12232/0D598F6140E94C51BE0945CEF5FA28EE)

```
//package.json
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
    }
};

```
