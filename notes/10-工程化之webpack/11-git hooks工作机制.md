# Git hooks工作机制


## 基本介绍

我们平时开发过程中，可能会出现多人协作的项目，那么这个时候，一定要保证提交到git仓库的代码是正确的，但是每个人各自在开发过程中严格遵守了eslint等相应规范呢？不一定，假如没有，这时候是不被允许提交代码的，这就是git hooks的作用，主要是用来**在代码提交之前强制进行lint，否则不允许提交代码至远程仓库**


git hooks 即git钩子，每个钩子对应一个任务，例如 commit , push等操作都是一个钩子，当这些钩子被触发时，我们可以通过定义一些shell脚本，去执行相应的操作。

## 自定义钩子操作

```
cd .git
cd hooks
```
我们就可以发现下面有很多脚本：

![image](http://note.youdao.com/yws/res/12182/1F7DC129A1734E49A8FD2B3B85F08F7C)

例如，我们想要在git commit之前执行某些操作，这时我们就可以自定义一个pre-commit脚本，在脚本中输入我们的自定义操作
```
//pre-commit
#!/bin/sh
echo 'pre commit do this file'
```
此处，我们只是简单的打印出一句话，然后我们执行git commit操作，就会发现它在执行commit之前，先执行了该脚本文件。

![image](http://note.youdao.com/yws/res/12189/7C7C8B65ADB44AA2AE0AABBD8EFC1AFD)

## git hooks结合eslint

对于很多前端开发者来说，可能并不擅长写shell脚本命令，这个时候就出现了一个npm包：Husky 我们可以使用该插件，就可以很好的实现git hooks自定义的相关操作。

### Husky

#### 第一步：安装插件
```
npm install husky --save-dev
```

#### 第二步：修改package.json
```
{
  "name": "eslint-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "eslint": "^7.12.1",
    "eslint-config-standard": "^16.0.1",
    "eslint-plugin-import": "^2.22.1",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^4.2.1",
    "husky": "^4.3.0",
    "stylelint": "^13.7.2"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run test"
    }
  }
}
```
即添加husky属性，并且添加各个钩子对应的命令，从而实现我们的需求。

#### 第三步：执行git命令

```
git add .
git commit -m 'update'
```
![image](http://note.youdao.com/yws/res/12202/3E51BA7617E346E4A29C55D50C82138E)

可以看到，在执行git commit之前自动执行了npm run test命令中的echo test命令。


#### 第四步：进一步增强功能，

通过husky已经完成了对钩子任务的自定义操作，但是husky只能简单的定义一些脚本命令，为了进一步增强自定义操作，我们引入了额另外一个插件，lint-staged， 通过它我们可以实现更复杂的自定义操作。

```
//第一步：安装插件
npm i lint-staged --save-dev


//第二步：修改package.json
{
  "name": "eslint-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "precommit": "lint-staged"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "eslint": "^7.12.1",
    "eslint-config-standard": "^16.0.1",
    "eslint-plugin-import": "^2.22.1",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^4.2.1",
    "husky": "^4.3.0",
    "stylelint": "^13.7.2"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run precommit"
    }
  },
  "lint-staged": {
      "*.js": [
        "eslint",
        "prettier"
      ]
  }
```

整个执行过程就是：
1. git commit -m 'update',
2. 触发husky中的 npm run precommit命令
3. 然后执行lint-staged操作，
4. 再执行eslint操作
5. 最后执行prettier格式化操作。


## 总结

通过本节的介绍，我们更多的是要知道这种git hooks工作机制，通过git的钩子，我们在git命令执行前，自定义我们想要的操作，从而去实现某些功能。
