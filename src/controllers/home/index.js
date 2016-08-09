'use strict';
module.exports = {
	//首页
	home: function* () {
		yield this.render('default/index',{title:'title is body', body: 'this is body.'});
	},
	search: function* () {
		yield this.render('default/search',{title:'title is search', body: 'this is search.'});
	}

};