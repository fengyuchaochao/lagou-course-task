# Proxy

## ES5的拦截方式

在es5中，采用Object.defineProperty()设置数据拦截， 从而在get/set加入自定义逻辑。
```
let obj = {};

let _name = 'kobe';
Object.defineProperty(obj, 'name', {
    get (val) {
        return _name;
    },
    set (val) {
        _name = val + '23';
        // this.name = val; //不能这样去赋值，否则会死循环
    }
});
console.log(obj.name); //kobe
obj.name = 'james';
console.log(obj.name); //james23
```

## ES6的拦截方式

在es6中，专门引入了Proxy实现数据代理，或者数据拦截。

Proxy常见钩子：

* get：获取属性时，会调用该钩子
* set：设置属性值时，会调用该钩子
* has：使用in操作符时，会调用该钩子
* ownKeys：遍历的时候，会调用该钩子
* deleteProperty：删除属性的时候，会调用该钩子
* apply： 函数调用的时候，会调用该钩子
* construct：new一个实例时，会调用该钩子

#### 案例1: 使用get/set钩子
```
let obj = {};

let proxyObj = new Proxy(obj, {
    get (target, prop) {
        return target[prop];
    },
    set (target, prop, val) {
        target[prop] = val;
    }
});
proxyObj.name = 'kobe';

console.log(proxyObj.name); //kobe
```

#### 案例2: 使用has钩子
```
let range = {
    start: 0,
    end: 5
};

let proxyRange = new Proxy(range, {
    has (target, val) {
        return val >= target.start && val <= target.end;
    }
});

console.log(1 in proxyRange); //true
```
即使用in运算符时，会自动调用has这个钩子函数。

#### 案例3：使用ownKeys钩子

当我们需要对外隐藏一些属性，或者不让某些属性可以遍历到时，我们就可以使用Proxy里的ownKeys钩子去实现。
```
let userInfo = {
    name: 'kobe',
    age: 41,
    _password: '***'
};
console.log(Object.keys(userInfo)); //["name", "age", "_password"]

userInfo = new Proxy(userInfo, {
   ownKeys (target) {
       return Object.keys(target).filter(item => !item.startsWith('_'));
   }
});
console.log(Object.keys(userInfo)); //["name", "age"]
```


#### 4. 综合案例

一个对象，我们希望某些属性作为私有属性，这些私有属性无法访问，也无法设置，也无法删除，更无法遍历。

我们先来分析一波儿：获取访问相关操作，我们会想到get钩子，设置属性，我们会想到set钩子，遍历我们想到ownKeys钩子，删除也会用到deleteProperty, 遍历时，我们想到ownKeys钩子。
```
let userInfo = {
    name: 'kobe',
    age: 41,
    _password: '***'
};

console.log(Object.keys(userInfo));

userInfo = new Proxy(userInfo, {
    get (target, prop) {
        if (prop.startsWith('_')) {
            throw new Error('私有属性不可以访问');
        } else {
            return target[prop];
        }
    },
    set (target, prop, val) {
        if (prop.startsWith('_')) {
            throw new Error('私有属性不可以修改');
        } else {
            return target[prop] = val;
        }
    },
    deleteProperty (target, prop) {
        if (prop.startsWith('_')) {
            throw new Error('私有属性不可以删除');
        } else {
            delete target[prop];
            return true;
        }
    },
    ownKeys (target) {
        return Object.keys(target).filter(item => !item.startsWith('_'));
    }
});


// console.log(userInfo['_password']); // 报错：私有属性不可以访问

// userInfo['_password'] = '******'; //报错：私有属性不可以修改

//delete userInfo['_password']; //报错：私有属性不可以删除

console.log(Object.keys(userInfo)); // ['name', 'age']
```
#### 5. 拦截函数调用

即当函数调用的时候，也可以被apply钩子拦截到，这个时候，我们就可以做一些操作，例如修改函数的返回值等等

```
let sum = (...args) => {
    let sum = 0;
    args.forEach(item => {
        sum += item
    });
    return sum;
};

sum = new Proxy(sum, {
   apply (target, ctx, args) {
       return target(...args) * 2;
   }
});

console.log(sum(1, 2, 3));
console.log(sum.call(null, 1, 2, 3));
console.log(sum.apply(null, [1, 2, 3]));
```

#### 5. new的拦截

即当我们使用new操作符创建对象实例时，就默认调用contruct钩子函数。

```
class User {
    constructor (name) {
        this.name = name;
    }
}

User = new Proxy(User, {
    construct (target, args, newTarget) {
        return new target(...args);
    }
});

let user = new User('kobe');
console.log(user); //{name: 'kobe'}
```

# Reflect

* 将Object内部的一些方法移植到Reflect中
* 让Object操作变成函数式写法
* Reflect中的方法与Proxy一一对应，完全一样。
 

1. 将Object内部的一些方法移植到Reflect中
```
console.log(Reflect);
```
![image](http://note.youdao.com/yws/res/7657/98A3900378014F5EA73D93DBF45E514A)

我们可以看到Object中常见的defineProperty等方法，在Reflect中都有定义。

```
let obj = {};

Object.defineProperty(obj,'name', {
    value: 'kobe'
});
Reflect.defineProperty(obj,'age', {
    value: 41
});
console.log(obj); //{name: "kobe", age: 41}

```

2. 让Object操作变成函数式写法

```
let obj = {
    name: 'kobe',
    age: 41
};

console.log(obj['name']);//kobe
console.log(Reflect.get(obj, 'name'));

console.log('name' in obj); //true
console.log(Reflect.has(obj, 'name')); //true

// delete obj.name;
Reflect.deleteProperty(obj, 'name');
console.log(obj);
```

总结：
* 获取属性：obj['key'] <=> Reflect.get(obj, 'key');
* in操作符 => Reflect.has()
* delete操作符 => Reflect.delete();

3. Reflect中的方法与Proxy一一对应，完全一样。

我们以上面的Proxy例子：

```
let userInfo = {
    name: 'kobe',
    age: 41,
    _password: '***'
};

console.log(Object.keys(userInfo));

userInfo = new Proxy(userInfo, {
    get (target, prop) {
        if (prop.startsWith('_')) {
            throw new Error('私有属性不可以访问');
        } else {
            return target[prop];
            //等价于
            //return Reflect.get(target, prop);
        }
    },
    set (target, prop, val) {
        if (prop.startsWith('_')) {
            throw new Error('私有属性不可以修改');
        } else {
            return target[prop] = val;
            //等价于
            //Reflect.set(target, prop. val);
        }
    },
    deleteProperty (target, prop) {
        if (prop.startsWith('_')) {
            throw new Error('私有属性不可以删除');
        } else {
            delete target[prop];
            //等价于
            //Reflect.deleteProperty(target, prop);
            return true;
        }
    },
    ownKeys (target) {
        return Object.keys(target).filter(item => !item.startsWith('_'));
        //Object.keys()等价于Reflect.ownKeys()
    }
});
```
从上面的代码可以看到： **Reflect中调用的get，set，deleteProperty,以及ownKeys等方法与Proxy中的钩子函数是完全一样的，参数也是完全一样的，所以在实际开发过程中，我们通常可以使用Proxy搭配Reflect使用。**


**总结：通过上面的介绍，我们基本知道了Proxy可以用于设置拦截，不仅可以对对象，还可以对函数，还可以对new操作符等各种场景进行拦截，很显然，它的拦截功能比defineProperty要强大很多，同时，我们又介绍了Reflect，它其实就是把Object操作或者方法进行了封装，经常与Proxy配合使用.**
