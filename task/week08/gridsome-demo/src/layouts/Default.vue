<template>
    <div class="layout">
        <!-- Navigation -->
        <header class="header">
            <h1>Laziji</h1>
            <h4>欢迎来到辣子鸡的个人博客</h4>
            <ul>
                <li>
                    <a href="">Github主页</a>
                </li>
                <li>
                    <a href="">博客源码</a>
                </li>
            </ul>
        </header>
        <!-- 插槽 -->
        <section class="content">
            <div class="left">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">最新动态</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/social">社交圈</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/blog">博客列表</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/project">开源项目</a>
                    </li>
                </ul>
            </div>
            <div class="right">
                <slot></slot>
            </div>
        </section>
        <!-- Footer -->
        <footer>
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 col-md-10 mx-auto">
                        <ul class="list-inline text-center">
                            <li class="list-inline-item">
                                <a href="#">
                <span class="fa-stack fa-lg">
                  <i class="fas fa-circle fa-stack-2x"></i>
                  <i class="fab fa-twitter fa-stack-1x fa-inverse"></i>
                </span>
                                </a>
                            </li>
                            <li class="list-inline-item">
                                <a href="#">
                <span class="fa-stack fa-lg">
                  <i class="fas fa-circle fa-stack-2x"></i>
                  <i class="fab fa-facebook-f fa-stack-1x fa-inverse"></i>
                </span>
                                </a>
                            </li>
                            <li class="list-inline-item">
                                <a href="#">
                <span class="fa-stack fa-lg">
                  <i class="fas fa-circle fa-stack-2x"></i>
                  <i class="fab fa-github fa-stack-1x fa-inverse"></i>
                </span>
                                </a>
                            </li>
                        </ul>
                        <p class="copyright text-muted">Copyright &copy; Your Website 2020</p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<static-query>
    query {
    metadata {
    siteName
    }
    }
</static-query>

<style>
    body {
        font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        margin: 0;
        padding: 0;
        line-height: 1.5;
    }

    .layout {
        margin: 0 auto;
    }

    header.header {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        align-items: center;
        padding: 30px;
        height: 250px;
        background: cornflowerblue;
        background: linear-gradient(to right, #6575BB, #B45064);
        color: #fff;
    }
    header.header ul {
        display: flex;
        margin-top: 30px;
    }
    header.header ul li{
        list-style: none;
        color: #fff;
        border: 1px solid #fff;
        background: #8C709F;
        padding: 8px 10px;
        margin-right: 20px;
        border-radius: 4px;
    }
    section.content {
        display: flex;
        max-width: 1200px;
        margin: auto
    }

    section.content > .left {
        width: 250px;
        padding: 30px;
        border: 1px solid #aaa;
        margin-right: 20px;
    }
    section.content > .left ul {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    section.content > .right {
        flex: 1;
        border: 1px solid #aaa;
        text-align: left;

    }

    .nav__link {
        margin-left: 20px;
    }
</style>
