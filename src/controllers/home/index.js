'use strict';
module.exports = {
	//首页
	home: function* (next) {
		yield this.render('default/index',{title:'title is body', body: 'this is body.'});
	},
	search: function* (next) {
		yield this.render('default/search',{title:'title is search', body: 'this is search.'});
	}

};