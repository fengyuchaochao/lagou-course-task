# ES Modules

## 基本特性

ES Modules主要有以下几个特性：
* ESM 会默认采用严格模式
* 每个ESM 都有自己单独的作用域
* ESM 是通过 cors的方式请求外部 js模块的
* ESM 引入的文件默认会延迟执行，相当于defer属性的作用

```
<!--script声明type为module，表示该script标签下的文件是一个es module-->
<script type="module">
    console.log('this is module')
</script>

<!--1. ESM 会默认采用严格模式-->
<script type="module">
    console.log(this) //undefined，因为严格模式下this不指向window
</script>

<!--2. 每个ESM 都有自己单独的作用域-->
<script type="module">
    var foo = 'kobe';
    console.log(foo) //kobe
</script>
<script type="module">
    //console.log(foo); //报错
</script>

<!--3. ESM 是通过 cors的方式请求外部 js模块的-->
<script type="module" src="https://unpkg.com/jquery@3.4.1/dist/jquery.min.js">

</script>

<!--4. ESM 引入的文件默认会延迟执行，相当于defer属性的作用-->

//index1.js里；console.log(1);
//index2.js里；console.log(2);
<script type="module" src="index1.js">
</script>
<script defer src="index2.js"></script>
<script>
    console.log(3)
</script>

//执行完以后，最后输出顺序式：3 1 2
```

## 基本使用


#### 写法1

即采用export导出，使用import导入
```
//module.js
export var name = 'kobe';
export function foo () {
    console.log('foo')
}
export class Person {}


//index.js
import {name, foo, Person} from './module.js'
```

#### 写法2
当需要同时导出多个变量时，我们可以最后统一导出

```
//module.js
var name = 'kobe';
function foo () {
    console.log('foo')
}
class Person {}

export {name, foo, Person}

//index.js
import {name, foo, Person} from './module.js'
```
#### 写法3

我们导出和导入的时候，都可以使用as对变量进行重命名


例如：对导出的变量重新命名
```
//module.js
var name = 'kobe';
function foo () {
    console.log('foo')
}
class Person {}

export {name as mName, foo as mFoo, Person as MPerson}


//index.js
import {mName, mFoo, MPerson} from './module.js'

```

例如：对导入的变量重新命名

```
//module.js
var name = 'kobe';
function foo () {
    console.log('foo')
}
class Person {}

export {name, foo, Person}


//index.js
import {name as mName, foo as mFoo, Person as MPerson} from './module.js'
```

#### 写法4

在对导出的变量进行重命名时，除了自定义的名字之外，也可以使用一个特殊的关键字：default

```
//module.js
var name = 'kobe';
export {name as default}
//等价于
export default name;

//index.js
import {default as name} from './module.js'
//等价于
import name from './module.js';
```

总结：以后就不要在混淆export和export default的区别啦，我们只需要记住导出就是用export,导入用import，然后我们可以对导出导入的变量进行as重命名，与此同时，也可以重命名为一个特殊的关键字default，针对于这种将变量重命名为default的写法，又提供了一个语法糖，即export default.

## 注意事项

#### 1. export无法直接导出一个变量,如果想直接导出一个变量，可以使用export default.

错误写法
```
var name = 'kobe';
var age = 41;

export name; //报错
export age; /
```
正确写法：
```
export var name = 'kobe';
export var age = 41;
```

#### 2. export {}只是一种写法，导出的并不是一个对象，import {} 也只是一种写法，并不是对象的解构。

```
//module.js
var name = 'kobe';
var age = 41;

let obj = {
    name,
    age
};
export obj; //报错
export {name, age}; //正确

//index.js
import {name, age} from './module.js';

console.log(name); //kobe
console.log(age); //41
```
从上面这个例子可以看到，export {} 只是一种写法，并不是真正导出一个对象，否则回报错，

```
//module.js
let obj = {
    name,
    age
};
export default obj; 

//index.js
import {name, age} from './module.js'; //报错
import obj from './module.js'; //正确
```
从上面的例子可以看到：我们通过export default导出了一个对象，
但是通过import {}引入时报错了，这也说明了import {}并不是真正的解构，它也只是一种写法。


#### 3. es module导出导入的是值的引用，而不是复制。

```
//module.js
var name = 'kobe';

export {name};

setTimeout(() => {
    name = 'james'
}, 1000);


//index.js
import {name} from './module.js';
console.log(name); //kobe

setTimeout(() => {
    console.log(name) //此时模块内部的name已修改为james，所以模块外部引用该变量时，也是修改之后的值。
}, 1500);

```

#### 4. 通过es module引入的模块，无法修改模块的值。

```
//module.js
var name = 'kobe';
var age = 41;
export {name, age}; 

//index.js
import {name, age} from './module.js';
name = 'james'; //报错：index.js:2 Uncaught TypeError: Assignment to constant variable.
console.log(name);
console.log(age);
```

## import 导入注意事项


#### 1. import路径的问题
```
// 导入的文件后缀不能省略
import {name} from './module'; //报错

// 相对路径的 ./不能省略，否则会被认为是在加载module.js这个第三方模块
import {name} from 'module.js' //报错

import {name} from './module.js' //正确

//引入的路径也可以是完整的url
import {name} from 'http://localhost/module.js' //正确

```
#### 2. import导入的模块有时候只需要执行，不需要导入变量

```
//引入的模块，可能只是需要执行模块代码，并不需要导出变量或者对象，此时可以采用下面的写法
import {} from './module.js' //正确
import './module.js' //正确，推荐写法

```

#### 3. 采用import * as obj from './module.js' 

```
//导出的成员比较多时，我们可以采用如下写法，将这些成员全部挂载到obj上。
import * as obj from './module.js'
console.log(obj.name);
console.log(obj.age);
```

#### 4. 动态导入模块

采用import关键字无法只能导入指定静态模块，无法动态导入模块，
此时可以采用import()函数实现，该函数返回的是promise。

```
import('./module.js').then((module) => {
    console.log(module.name);
    console.log(module.age);
})
```

#### 5. 导入默认成员的写法

```
//module.js
var name = 'kobe';
var age = 41;
export {name, age};
export default var sport = 'basketball';


//index.js
import {name, age, default as sport} from './module.js';
//或者
import sport, {name, age} from './module.js';
```

#### 6. 直接导出导入成员

![image](http://note.youdao.com/yws/res/11726/AB20B238B91C47F097B6DBCBBF6B7A45)

```
// button.js
export var Button = 'button';

//dialog.js
export var Dialog = 'Dialog';

//form.js
export var Form = 'form';

//index.js
import {Button} from './components/button.js';
import {Form} from './components/form.js';
import {Dialog} from './components/dialog.js';

export {Button, Form, Dialog}

//home.js
import {Button, Dialog, Form} from './index'
```
说明：以上代码是一个典型的应用场景，即如果有多个基础模块时，我们可以把这些基础模块导入到一个集中的模块index.js文件中，并且直接导出，这样在其他文件中就可以直接导入index.js即可。



## ES Modules兼容性方案

### ES Modules in Browser

ES Modules是在es6中才提出来的，所以部分浏览器器可能还没有支持，所以当我们使用ES Modules就一定要考虑如何进行Polyfill，以此来兼容更多浏览器。


我们平时开发可能没刻意注意这些，那是因为我们常用的打包工具，例如webpack等，利用babel早已将es6+的语法编译成了低版本的es语法。

那假如没有这些打包工具的支持，如何进行polyfill呢？可以采用 browser-es-module-loader 这个插件实现。

详情可以参考：
https://www.npmjs.com/package/browser-es-module-loader

本质上还是使用babel间接对我们的文件中es6+语法进行编译，从而转成低版本的es语法，从而支持更多的浏览器。

### ES Modules in Node

我们都知道在node中采用的是commonjs规范，但是随着ES Modules的发展，肯定希望所有es生态都可以采用这种模块化规范，所以node其实也一直在致力于支持ES Modules，并且已经支持了一些方式（只是在实验阶段，还没有正式提出）


#### 一. 我们就来看看如何在node中支持ES Modules？


1. 第一步：将.js文件修改为.mjs
```
//module.mjs
export var name = 'kobe';
import {name} from './module.mjs';

//index.mjs
import {name} from './module.mjs';
import fs from 'fs';

console.log(name);
console.log(fs);

```
2. 第二步：执行node --experimental-modules命令

```
node --experimental-modules index.mjs
```
注意：必须要加后面的参数：-experimental-modules

#### 二. 在es modules中导入commonjs模块

```
//commonjs.js
exports.foo = '打篮球';

//index.mjs
import module from './commonjs';
console.log(module.foo); //打篮球

```
依然是执行：

```
node --experimental-modules index.mjs
```

注意：
1. 在es modules中只能导入commonjs导入的默认成员。
2. 在commonjs模块中无法导入es modules

#### 三. 在es modules中引用node的全局成员

```
//commonjs.js
console.log(require);

console.log(module);

console.log(exports);

console.log(__dirname);

console.log(__filename);

```
我们执行node commonjs.js时，发现这些全局变量都是可以正常打印出来的，

但是如何是在es module中呢？

```
//index.mjs

console.log(require);

console.log(module);

console.log(exports);

console.log(__dirname);

console.log(__filename);

```
此时发现，代码直接报错啦，找不到这些全局成员，这就是使用es modules 和commonjs时的区别，因为这些全局成员都是以commonjs规范集成到了node内部，所以使用es modules时自然访问不到啦， 那如何在es modules中使用这些全局成员呢？

首先 require, module,exports等全局成员就是直接使用export，imort替换啦，这里主要说一下__dirname和__filename如何获取？
```
import { fileURLToPath } from 'url';
import {dirname} from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__filename);
console.log(__dirname);

```

#### Babel兼容方案

![image](http://note.youdao.com/yws/res/11796/2AD31A1514C243A5B9E8E38D404AF40E)

babel其实也是基于插件机制去实现的，也就是说babel本身不做任何的编译工作，而是通过指定的插件来完成，例如要将尖头函数编译成普通函数就是是通过arrow-functions插件等等，

而我们常用的@babel/preset-env其实就是目前所有特性的一个插件的集合，平时我们使用babel的时候，只要指定该插件即可。


即如何在node使用babel进行编译？代码结构如下：

![image](http://note.youdao.com/yws/res/11804/D893383B09894BFB9ADE4470D9937240)

1. 第一步：安装相关依赖
```
 npm i @babel/node @babel/core @babel/preset-env --save-dev

```
2. 第二步：配置script命令
```
"scripts": {
    "babel": "babel-node",
  },
```
3. 第二步：执行命令

```
npm run babel index.js //执行成功
```
