const c1 = () => import(/* webpackChunkName: "page--src--pages--social-vue" */ "/Users/fengyuchao/Documents/lagou/gridsome-demo/src/pages/social.vue")
const c2 = () => import(/* webpackChunkName: "page--src--pages--project-vue" */ "/Users/fengyuchao/Documents/lagou/gridsome-demo/src/pages/project.vue")
const c3 = () => import(/* webpackChunkName: "page--src--pages--blog-vue" */ "/Users/fengyuchao/Documents/lagou/gridsome-demo/src/pages/blog.vue")
const c4 = () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/Users/fengyuchao/Documents/lagou/gridsome-demo/node_modules/gridsome/app/pages/404.vue")
const c5 = () => import(/* webpackChunkName: "page--src--pages--index-vue" */ "/Users/fengyuchao/Documents/lagou/gridsome-demo/src/pages/Index.vue")

export default [
  {
    path: "/social/",
    component: c1
  },
  {
    path: "/project/",
    component: c2
  },
  {
    path: "/blog/",
    component: c3
  },
  {
    name: "404",
    path: "/404/",
    component: c4
  },
  {
    name: "home",
    path: "/",
    component: c5
  },
  {
    name: "*",
    path: "*",
    component: c4
  }
]
