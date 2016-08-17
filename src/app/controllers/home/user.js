'use strict';
let mongoose = require('mongoose'),
		User = mongoose.model('User')

exports = {
	// 显示注册页面
	showSignup: function *(next) {
	  yield this.render('pages/signup', {
	    title: '注册页面'
	  });
	},

	// 显示登录页面
	showSignin: function *(next) {
	  yield this.render('pages/signin', {
	    title: '登录页面'
	  })
	},

	// 登陆成功
	signup: function *(next) {
	  var _user = this.request.body.user

	  var user = yield User.findOne({name: _user.name}).exec()
	  if (user) {
	    this.redirect('/signin')
	  }else {
	    user = new User(_user)
	    yield user.save()
	    
	    this.session.user = user;
	    this.redirect('/')
	  }
	},

	/**
	 * [*signin 用户注册]
	 * @param {Function} next
	 * @yield {[type]}
	 */
	signin: function *(next) {
	  var _user = this.request.body.user
	  var name = _user.name
	  var password = _user.password

	  var user = yield User.findOne({name: name}).exec();
	  if (!user) {
	    this.redirect('/signup')
	  }else{
	    var isMatch = yield user.comparePassword(password, user.password)
	    if (isMatch) {
	      this.session.user = user
	      this.redirect('/')
	    }else {
	      this.redirect('/signin')
	    }
	  }
	},

	// logout
	logout: function *(next) {
	  delete this.session.user
	  this.redirect('/')
	},

	// userlist page
	list: function *(next) {
	  var users = yield User
	    .find({})
	    .sort('meta.updateAt')
	    .exec()

	  yield this.render('pages/userlist', {
	    title: 'imooc 用户列表页',
	    users: users
	  })
	},

	// midware for user
	signinRequired: function *(next) {
	  var user = this.session.user;

	  if (!user) {
	    this.redirect('/signin');
	  }else{
	    yield next;
	  }
	},

	adminRequired: function *(next) {
	  var user = this.session.user;

	  if (user.role <= 10) {
	    this.redirect('/signin');
	  }else{
	    yield next;
	  }
	},

}