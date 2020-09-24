# 封装ajax

## 1. ajax原理

问到ajax原理，其实就是让你手写原生ajax请求
```
let xhr;
if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
} else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
}
//2.配置参数
xhr.open('GET', 'url', true);

//3.发送请求
xhr.send();

//4. 与服务器交互
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        let result = JSON.parse(xhr.responseText);
        callback(result);
    }
};
```
## 2. 回调函数封装
```
function ajax (url, callback) {
    //1. 创建xmlHttpRequest对象
    let xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    //2.配置参数
    xhr.open('GET', url, true);
    
    //3.发送请求
    xhr.send();

    //4. 与服务器交互
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let result = JSON.parse(xhr.responseText);
            callback(result);
        }
    };
}

let url = 'http://jsonplaceholder.typicode.com/users';
ajax(url, (result) => {
    console.log(result);
});
```

但是采用回调函数，会出现**回调地狱**的问题。

项目中一个很常见的场景：先请求数据1，然后请求到以后，再请求数据2，请求到数据2以后，再发送请求3， 也就说发送请求很可能是依赖上一个请求返回的数据。

这种场景下，如果还使用回调的方式去异步编程，就会出现**回调地狱**
```
ajax('static/json/a.json', (result) => {
    console.log(result);
    ajax('static/json/b.json', (result) => {
        console.log(result);
        ajax('static/json/c.json', (result) => {
            console.log(result);

        });
    });
});
```

## 3. promise封装

```
function ajax (url, callback) {
    let xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let result = JSON.parse(xhr.responseText);
            callback(result);
        }
    };
}

//模拟实现一个axios库
function axios (url) {
    return new Promise((resolve, reject) => {
        ajax(url, function (result) {
            resolve(result);
        })
    });
}

axios('static/json/a.json')
    .then((result) => {
        console.log(result);
        return axios('static/json/b.json');
    }).then((result) => {
        console.log(result);
        return axios('static/json/c.json');
    }).then((result) => {
        console.log(result);
    }).catch(err => {
        console.log(err)
    });
```

说明：**如果任意一个请求发生错误，我们也可以最后使用catch统一捕获错误，就不用单独为每个promise设置catch了。**

以上代码还有一个细节要注意：

```
axios('static/json/a.json')
    .then((result) => {
        console.log(result); //正常执行：输出a.json的具体值
    }).then((result) => {
        console.log(result); //正常执行：undefined
    });
```
我们稍微改造一下，请求一个不存在的文件aa.json，这时axios内部会报错, 此时，我们并没有捕获该错误，那第二个then还会执行吗？
```
axios('static/json/aa.json')
    .then((result) => {
        console.log(result); //没执行
    }).then((result) => {
        console.log(result); //没执行
    });
```
我们可以看到，由于promise报错，then方法的第一个回调肯定不会执行，同时，我们又没有传入第二个回调参数来捕获错误，所以下面的then方法也不会执行。

我们来改造一下：
```
axios('static/json/aa.json')
    .then((result) => {
        console.log(result); //不执行
    }, (err) => {
        console.log(err); //正常执行 
    }).then((result) => {
        console.log(result); //正常执行，值为undefined
    });
```
此时，即使promise报错，但是我们捕获了该错误，所以第二个then也会正常执行，只不过result值为undefined。

## 4. Generator封装

```
function ajax (url, successCallback, errorCallback) {
    let xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let result = JSON.parse(xhr.responseText);
            successCallback && successCallback(result);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            let err = xhr.statusText;
            errorCallback && errorCallback(err);
        }
    }
}

function request (url) {
    ajax(url, (res) => {
        iterator.next(res);
    });
}
function* gen () {
    let result1 = yield request('static/json/a.json');
    console.log(result1);
    let result2 = yield request('static/json/b.json');
    console.log(result2);
    let result3 = yield request('static/json/c.json');
    console.log(result3);
}
let iterator = gen()
iterator.next();

```
刚开始可能会有这样一个疑问？生成器函数不是每次都需要我们手动调用next方法执行吗？，注意是**手动调用**，这句话没错，但前提是**同步任务的执行才需要我们每次都手动调用next方法**，如果是一个异步任务呢？**异步任务就不需要我们手动调用next方法了，例如ajax请求，每次在请求成功的回调函数里，自动执行next方法不就可以啦**


## 5. async/await封装

```
function ajax (url, successCallback, errorCallback) {
    let xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let result = JSON.parse(xhr.responseText);
            successCallback && successCallback(result);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            let err = xhr.statusText;
            errorCallback && errorCallback(err);
        }
    }
}
function axios (url) {
    return new Promise((resolve, reject) => {
        ajax(url, (result) => {
            resolve(result);
        }, (err) => {
            reject(err);
        })
    });
}

async function request () {
    let result1 = await axios('static/json/a.json');
    console.log(result1);
    let result2 = await axios('static/json/b.json');
    console.log(result2);
    let result3 = await axios('static/json/c.json');
    console.log(result3);
}

request();
```
