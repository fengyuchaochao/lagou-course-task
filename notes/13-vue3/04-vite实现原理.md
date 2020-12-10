
# vue3.0-vite实现原理

## vite特性

* 快速冷启动
* 模块热更新
* 按需编译
* 开箱即用

针对以上几点，我们需要对比vue-cli或者webpack说明：

#### 1. 快速冷启动

vite: 
![image](http://note.youdao.com/yws/res/14687/923F80D027E447D89D15087A9CA6439E)

vue-cli:
![image](http://note.youdao.com/yws/res/14689/8D08FBDDB5164F44A8A3A2722469C663)

从上面这两张图可以看到，vue-cli启动本地服务时，需要先进行打包，然后将所有的文件打包到bundle.js里（此时是在内存中），然后访问内存中的文件，但是这种方式，随着项目越来越大，bundle.js体积也会越来越大，那么速度自然而言也会越来越慢。

即vite是默认使用原生模块化机制:es modules，不进行打包，对于需要编译的文件，例如.vue文件，也是请求的时候，实时编译即可完成

#### 2. 模块热更新

* 当某个文件发生变化时，vite会直接编译当前所修改的文件，实现模块热更新，
* 而webpack需要以这个文件为入口，重新执行一次build操作，所涉及到的依赖也都会被重新加载一遍。


#### 3. 按需编译

webpack需要首先将所有模块全部打包到bundle.js中，而vite只需要按需编译，所谓按需编译，就是不需要事先全部编译打包，而是当请求到.vue文件时，自动加载@vue/compiler-sfc去进行实时编译。

#### 4. 开箱即用

vite默认支持：

* typescript
* less/sass/stylus/postcss（需要单独安装）
* jsx
* web assembly

而webpack或者vue-cli需要我们单独配置。


## 实现一个简单的vite工具

首先，来看一下vite的核心功能有哪些？

* 开启一个web服务
* 编译单文件组件，即它可以拦截浏览器不能识别的模块，并对其进行编译
* 模块热更新

<b>
主体思路：采用koa去开启一个本地web服务，同时利用koa的中间件思想去拦截请求，例如：请求到了一个html文件，则正常返回即可，如果请求到了.vue单文件组件，则采用@vue/compiler-sfc去对其进行编译，最终返回浏览器可以执行的javascript代码。
</b>

#### 完整代码如下：

```
#!/usr/bin/env node
const path = require('path');
const {Readable} = require('stream');
const Koa = require('koa');
const send = require('koa-send');
const compilerSFC = require('@vue/compiler-sfc');
const app = new Koa();

const streamToString = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => {
            resolve(Buffer.concat(chunks).toString('utf-8'))
        });
        stream.on('error', reject)
    });
};

function stringToStream (str) {
    const stream = new Readable();
    stream.push(str);
    stream.push(null);
    return stream;
}

//3.加载第三方模块
app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/@modules/')) {
        const moduleName = ctx.path.substr(10);
        const pkgPath = path.join(process.cwd(), 'node_modules', moduleName, 'package.json');
        const pkg = require(pkgPath);
        ctx.path = path.join('/node_modules', moduleName, pkg.module)
    }
    await next();
});

//1. 开启静态文件服务器
app.use(async (ctx, next) => {
    await send(ctx, ctx.path, {
        root: process.cwd(),
        index: 'index.html'
    });
    await next();
});

//4。处理单文件组件
app.use(async (ctx, next) => {
    if (ctx.path.endsWith('.vue')) {
        const contents = await streamToString(ctx.body);
        let {descriptor} = compilerSFC.parse(contents);
        let code;
        if (!ctx.query.type) {
            code = descriptor.script.content;
            code = code.replace(/export\s+default\s+/g, 'const __script = ');
            code += `
                import {render as __render} from "${ctx.path}?type=template"
                __script.render = __render;
                export default __script;
            `
        } else if (ctx.query.type === 'template') {
            const templateRender = compilerSFC.compileTemplate({
                source: descriptor.template.content
            });
            code = templateRender.code;
        }
        ctx.type = 'application/javascript';
        ctx.body = stringToStream(code);
    }
    await next();
});

//2. 修改第三方模块的路径
app.use(async (ctx, next) => {
   if (ctx.type === 'application/javascript') {
       const contents = await streamToString(ctx.body);
       ctx.body = contents
           .replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
           .replace(/process\.env\.NODE_ENV/g, '"development"');
   }
});



app.listen(3000, () => {
    console.log('server running on http://localhost:3000')
});

```
