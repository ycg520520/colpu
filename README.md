# 基于koa开发的网站: Colpu
这是一个基于koa的开发的开源网站系统。整个网站的基于MVC风格的代码架构设计开发。参看：[靠谱网](http://www.colpu.com)

## 目录结构
```
├─ src/: 开发目录；
│  ├─ app/: 应用程序文件的目录
│  │  ├─ components/: 存放react组建文件的目录；
│  │  ├─ controllers/：存放控制器代码文件的目录；
│  │  ├─ libs/：存放自定义代码库和中间件文件的目录；
│  │  ├─ models/：存放模型文件的目录；
│  │  ├─ routes/：存放路由文件的目录；
│  │  ├─ views/：存放主题模版文件的目录；
│  │  │  ├─ default/：网站默认主题文件的目录；
│  │  │  ├─ admin/：网站后台主题文件的目录；
│  ├─ bin/：启动脚本；
│  ├─ config/：存放配置文件的目录；
│  ├─ static/：存放前端静态资源文件的目录；
│  │  ├─ images/：静态资源图片文件的目录；
│  │  ├─ js/：静态资源js文件的目录；
│  │  ├─ favicon.ico：网站图标文件；
│  │  ├─ sass/：静态资源sass原始文件的目录；
│  │  ├─ styles/：静态资源css原始文件的目录；
│  │  ├─ upload/：静态资源上传存储文件的目录可更具需求设置到其它位置；
│  │  ├─ vendors/：三方静态资源存储文件的目录通过bower安装；
│  ├─ index.js：项目入口启动文件；
├─ dist/：存放上线打包文件的目录；
├─ test/：存放测试文件的目录；
├─ .babelrc：统一编码配置文件，`针对babel编译`；
├─ .bowerrc：自定义bower下载的代码包的目录；
├─ .editorconfig：统一编码配置文件，`针对支持editorconfig编辑器`；
├─ .gitignore：这是git忽略配置文件，`推送到git时忽略的文件配置列表`；
├─ .jshintrc：js语法校验配置文件；
├─ .npmignore：npm包发布忽略配置文件；
├─ gulpfile.js：gulp自动化构建工具配置启动文件；
├─ LICENSE.txt：软件许可证文件；
├─ bower.json：bower安装配置文件静态资源包下载管理；
├─ package.json：开发运行依赖包配置文件；
├─ README.md：项目阅读说明文件；
```

## 特点
> 1. MVC代码风格
> 2. nunjucks模板引擎
> 3. 评论
> 4. Markdown 格式支持
> 5. highlight.js 代码高亮
> 6. Nodejs
> 7. Mongoose mongodb ORM module
> 8. 后台管理

## 安装
> 1. npm install -g pm2 #全局安装pm2服务器管理工具
> 2. git clone https://github.com/yc520520/colpu.git
> 3. cd colpu
> 4. npm install #安装项目运行的npm包
> 5. bower install #安装项目运行依赖的静态资源库

## 屏幕截图
![img](https://avatars3.githubusercontent.com/u/2937870?v=3&s=460)
