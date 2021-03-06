'use strict';
// 常量定义
const DIR = __dirname;

// 全局所需相关模块
global.config = require('./config/config');
global.fs = require('fs');
global.path = require('path');
global.unit = require('./libs/units');

// 自动加载models下面的文件
unit.autoLoad(DIR + '/models');

// 引入koa框架相关模块
const app = new (require('koa'))(),
  router = new (require('koa-router'))(),
  session = require('koa-session'),
  bodyparser = require('koa-bodyparser'),
  _static = require('koa-static'),
  views = require('koa-views'),
  convert = require('koa-convert'); //中间件转换器

// 引入日期处理类库: 用于解析、检验、操作、以及显示日期
const moment = require('moment');
  moment.locale('zh-cn'); // 设置语言

// 引入模版引擎
const nunjucks = require('nunjucks');
      nunjucks.configure(DIR + '/views/default'); // 配置前台模板路径位置

// 引入数据库模块
const mongoose = require('mongoose');

// 链接数据库
mongoose.connect(config.db.connect);
// var User = mongoose.model('User');

// 引入路由模块并加载路由
(require('./config/router'))(router);  // 前台路由
// (require('./config/router_admin'))(router); // 后台管理路由
// console.log(config.port)
// console.log(this.state)
app
  // 全局挂载moment
  .use(convert(function* (next){
    this.state = {
      moment: moment
    };
    yield next;
  }))
  .use(convert(_static(DIR)))
  .use(convert(views(DIR + '/views', {
    map: {html: 'nunjucks'},
    extension:'html'
  })))
  .use(convert(session(app)))
  .use(convert(bodyparser()))
  .use(convert(router.routes()))
  .use(convert(router.allowedMethods()))
  .on('error', function(err) {
  	if (process.env.NODE_ENV !== 'production') {
  		console.error(err.message);
  		console.error(err);
  	}
  })
  // 服务启用端口
  .listen(config.port, function() {
    console.log('网站启用端口在: ' + config.port);
  });