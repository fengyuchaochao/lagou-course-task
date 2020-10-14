# Yeoman

## 简介
Yeoman，一个强大的前端构建工具，说到这儿，可能很多人只听说过webpack, 以及基于webpack的一些脚手架：
* vue-cli：针对vue项目
* create-react-app：针对react项目
* angular-cli：针对angular项目

我们平时开发过程中，可能用到上面这三种会比较多，因为他们都是针对不同框架独有的一个脚手架，

那Yeoman与这些脚手架的区别在哪呢？Yeoman其实是一个更强大的工具，它可以根据不同的配置，不同的generator去生成的不同的项目模版，可以简单理解为，通过它即可以创建vue项目模版，也可以创建react项目模版，当然也可以创建angular项目模版。

## 基本使用

1. 安装yeoman
```
yarn global add yo //注意yarn安装不是用-g
```
2. 安装指定generator
```
yarn global add generator-node 
```
3. 通过yo运行genrator
```
mkdir yeoman-demo
cd yeoman-demo
yo node
```
至此，我们就创建了一个基于node的项目模版

