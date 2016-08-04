'use static';
const Index = require('../controllers/home/index');

/**
 * 导出模块
 */
module.exports = function(router){
	// router.opts = {prefix:'/home'}

	router.get('/', Index.home);
	router.get('/search', Index.search);

	// 对非法路由进行处理
	router.get('*', function* (next){
		var data = {
		  title: '网站错误提示信息:',
		  status: this.status || 500,
		  message: this.message || '服务器出错了。',
		}
		switch(data.status){
		  case 404:
		    yield this.render('default/404',data);
		    break;
		  case 500:
		    yield this.render('default/500',data);
		    break;
		  default:
		    yield this.render('default/error',data);
		}
	});
}