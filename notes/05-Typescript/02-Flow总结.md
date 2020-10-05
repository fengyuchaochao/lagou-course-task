# Flow

Javascript本身是弱类型语言，Flow就是为了解决弱类型的问题，通过在代码中加入一些类型注解，从而达到静态类型语言的效果。



## 环境搭建

#### flow安装
```
//第一步：创建package.json文件
npm init

//第二步：安装flow
npm i flow-bin --save-dev

//第三步：创建.flowcofig文件
flow init 

//第四步：执行flow命名
flow
```

注意：执行flow命令时，只有相应的文件头部添加了@flow注释，该文件才会被做类型检测。

```
//@flow

或者

/*@flow*/
```

#### 移除flow注解

1. 使用官方插件flow-remove-type
```
//安装
npm  i flow-remove-type --save-dev

//执行命令
flow-remove-type src -d dist

```
2. 使用babel配合@babel/preset-flow进行移除


## 基本使用


#### 类型推断

即我们有时候也可以也可以不用添加注解，flow也可以自动推断当前需要的是什么类型的数据，如果传入的不符合，则会报错

```
//@flow
function sum (a) {
    return a * a;
}

sum('100');

```
上面的代码，我们并没有手动去给a参数做类型注解，但在执行flow命令的时候，依然会报错，这就是flow的类型推断。

当然，在实际开发中，推荐去手动的都加上类型注解，因为这样可以更加明确的说明当前变量使用的是什么类型，后期维护也更容易。


#### 类型注解

1. 给原始类型数据添加注解

```
let a: number = 10;
let b: number = NaN;
let c: boolean = true;
let d: string = 'str';
let e: void = undefined;
let f: null = null;
let g: symbol = Symbol()
```
2. 给数组添加类型注解
```
//表示数组的元素全部都是数字
let arr1: Array<number> = [1, 2, 3, 4]; //写法1
let arr2: number[] = [1, 2, 3, 4];  //写法2

let arr3: [string, number] = ['str', 1]; //只能包含两个元素，且第一个元素是字符串，第二个元素是数字
```
3. 给对象添加类型注解

```
//表示该对象必须有两个属性，且第一个是字符串，第二个是数字
let obj1: {name: string,age: number} = {name: 'kobe', age: 41};

//属性后面加一个？表示该参数可有可无
let obj2: {name: string,age?: number} = {name: 'kobe'};

//表示该对象的key必须是string，value必须是number
let obj3: {[string]: number} = {age: 41}
```
4. 给函数添加类型注解

一般主要就是对函数的参数和返回值进行注解
```
//表示函数的参数a和b必须是number,且返回值也是number
function sum (a: number, b: number): number {
    return a + b;
}


//表示foo的回调函数必须有两个参数，返回值可以为空
function foo (callback: (string, number) => void) {
    callback('str', 100)
}
foo(function (str, n) {
    console.log(str)
    console.log(n)
});

```

5. 特殊情况

```
//表示type变量只能有三个具体值
const type: 'success' | 'warning' | 'fail' = 'success';

//表示a变量可以是字符串，也可以是数字
const a: string | numbre = 1;

//也可以设置别名
let StringOrNumber = string | number;
const a: StringOrNumber = 1;

//表示该变量既可以是数字，也可以是null或者undefined
const num1: ?number = null;
const num2: ?number = undefined;
const num3: ?number = 1;

//mixed和any都是用于说明当前变量可以是任意类型
//区别主要是mixed是强类型，any是弱类型
function passMixed (value: mixed) {
    console.log(value * value)
}
passMixed('str'); //语法层面会报错


function passAny (value: any) {
    console.log(value * value)
}
passAny(2); //语法层面不会报错
```

6. 针对不同的环境，例如浏览器环境，node环境等，flow也提供的不同的api支持
```
let ele: HTMLElement = document.getElementById('app');
```

## 总结

通过上面的总结，我们已经知道了flow的基本使用，同时也要明白flow的作用是什么，当然flow实际上还有很多的用法，具体我们可以参考：https://www.saltycrane.com/cheat-sheets/flow-type/latest/

