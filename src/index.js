"use strict";
// 常量定义
const DIR = __dirname;

/**
 * 引入相关模块
 */

// 全局所需相关模块
global.config = require('./config/config');
global.fs = require('fs');
global.path = require('path');
global.unit = require('./libs/units');

// 自动加载models下面的文件
unit.autoLoad(DIR + '/models')

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

// 引入模版引擎
const handlebars = require('handlebars');

// 引入数据库模块
const mongoose = require('mongoose');

// 链接数据库
/*mongoose.connect('mongodb://localhost/imooc');
var User = mongoose.model('User');*/

// 引入路由模块并加载路由
(require('./config/router'))(router);  // 前台路由
// (require('./config/router_admin'))(router); // 后台管理路由

app
  .use(convert(_static(DIR+'/static/')))
  .use(convert(views(DIR + '/views/', {
    map: {html:'handlebars'},
    extension:'html'
  })))
  .use(convert(session(app)))
  .use(convert(bodyparser()))
  .use(convert(router.routes()))
  .use(convert(router.allowedMethods()))
  .on('error', function(err, ctx) {
  	if (process.env.NODE_ENV != 'production') {
  		console.error(err.message);
  		console.error(err);
  	}
  })


  // 服务启用端口
  .listen(config.port, function() {
    console.log('网站启用端口在: ' + config.port);
  })

// 导出app模块
// module.exports = app;