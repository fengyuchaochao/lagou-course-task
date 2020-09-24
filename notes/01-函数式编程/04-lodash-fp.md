# Lodash FP

FP,即Functional Programming, 即函数式编程的缩写，lodash中有一个专门的fp模块，这个模块提供了更加友好和方便的函数式编程的API.

## lodash模块与lodash/fp模块的区别

我们从一个实际的例子出发：

将 字符串 NEVER SAY DIE 转换成 never-say-die

```
//使用lodash模块的api：

const _ = require('lodash');

let split = _.curry(function (sep, str) {
    return _.split(str, sep);
});
let map = _.curry(function (fn, array) {
    return _.map(array, fn);
});
let join = _.curry(function (sep, array) {
    return _.join(array, sep);
});

let fn = _.flowRight(join('-'), map(_.toLower), split(' '));
console.log(fn('NEVER SAY DIE'));
```
```
//使用lodash/fp模块的api：

const fp = require('lodash/fp');
const fn = fp.flowRight(fp.join('-'), fp.map(fp.toLower), fp.split(' '));
console.log(fn('NEVER SAY DIE'));
```

很显然，我们看到，**采用lodash/fp模块中的api会简洁很多，为什么呢？因为lodash/fp模块下的api本身就是函数柯里化之后的api，所以很容易就可以直接在函数组合中使用，而lodash模块中提供的api，支持多个参数，必须要我们手动对其进行柯里化之后，才可以在函数组合中使用。**

接下来，我们再进一步体会一下两者的区别：例如map方法

```
const _ = require('lodash');
const fp = require('lodash/fp');

_.map([1, 2, 3], function (a, b, c) {
    console.log(a); //数组元素值
    console.log(b); //数组索引值
    console.log(c); //数组本身
});


fp.map((item) => console.log(item), [1, 2, 3]);
//等价于
fp.map((item) => console.log(item))([1, 2, 3]);
```

lodash模块中的map方法的第一个参数是数据，第二个参数才是函数，并且有3个参数，而loash/fp中的map方法已经是柯里化之后的函数啦，支持传入部分参数，而且第一个参数是函数，第二个参数才是数据。

