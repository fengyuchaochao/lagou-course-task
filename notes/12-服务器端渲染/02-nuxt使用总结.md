 # nuxt使用总结


## nuxt使用方式

![image](http://note.youdao.com/yws/res/14343/569CEF159BD040BAAB92A807F876F08C)

新手的话，还是推荐使用nuxt官方命令去初始化一个nuxt项目。

## 基本使用



## 不同点

这里主要说一下，采用nuxt开发项目，与采用vue-cli开发有哪些不同点：

1. 路由配置方式不同，nuxt项目是根据目录结构默认生成路由，当然实际开发中，推荐在nuxt.config.js配置文件中，自定义路由规则。

```
//案例：
module.exports = {
    router: {
        base: '/',
        linkActiveClass: 'active', //设置导航高亮
        //自定义路由规则
        extendRoutes (routes, resolve) {
            routes.splice(0); //清除默认的路由规则
            routes.push(...[
                {
                    path: '/',
                    component: resolve(__dirname, 'pages/layouts'),
                    children: [
                        {
                            path: '/',
                            name: 'Home',
                            component: resolve(__dirname, 'pages/home'),
                        },
                        {
                            path: '/login',
                            name: 'Login',
                            component: resolve(__dirname, 'pages/login'),
                        }
                    ]
                }
            ])
        }
    }
};
```

2. 路由显示组件与路由跳转组件不同

```
router-link => nuxt-link
router-view => nuxt-child
```
虽然组件名不同，但是使用方法基本完全一样。

3. 中间件 middleware的使用

nuxt提供了中间件，可以在组件渲染前去执行某些逻辑，典型的场景就是：验证用户是否登录，如果未登录，某些页面是不让访问的，这个时候，我们就可以在相应的页面配置中间价。

```
//middleware/authenticated.js
export default function ({store, redirect}) {
    if (!store.state.user) {
        return redirect('/login')
    }
}

//vue组件
export default {
    middleware: 'authenticated'
}
```

## nuxt项目的部署上线

#### 一. 简单部署

简单部署：首先要明确要部署到服务器的文件有哪些，然后如何启动服务，然后正常访问即可。

如下就是我们需要部署到服务器的文件：
![image](http://note.youdao.com/yws/res/14374/9DEDAF0F5B814654AC96D3FE7959A310)

其中，我们需要首先执行nuxt build命令打包相关资源文件，最终的打包结果会在.nuxt/dist目录下。


然后我们把以上这些文件上传到服务器即可，


例如：我们在服务器上有个文件夹：

```
//1. 创建存放前端资源的文件夹
mkdir web-nuxt

//2. 把上图红框中的文件上传到web-nuxt目录下，
npm install; //安装依赖
npm run start; //启动临时服务
```
然后我们就可以通过当前服务器的ip+port去进行访问啦。


> 拓展：使用pm2开启守护进程

```
npm i pm2 --g

pm2 start npm --start //使用pm2开启npm后台命令
```

pm2常见命令：
![image](http://note.youdao.com/yws/res/14394/883E74C5086E48C59EF129F0D30435C0)

#### 二. 自动化部署-CI/CD

![image](http://note.youdao.com/yws/res/14398/2D33EB759CBF4D6AA7D4277A8AAD87CA)

常见CI/CD服务：

* Jenkins
* Gitlab CI
* Github Actions
* Travis CI
* Circle CI


**自动化部署的整体思路：主要就是我们可以监控到代码提交，然后我们可以通过自定义配置文件，通常是.yml文件，在该文件中，我们可以自定义一些脚本命令，例如：打包，压缩，上传，部署等等各种命令，当代码提交时，就会自动执行配置文件里的这些命令，然后实现自动化部署。**
