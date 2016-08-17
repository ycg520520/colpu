'use strict';
let mongoose = require('mongoose'); // mongoose模块

/**
 * [创建用户数据模型字段]
 */
let UserSchema = new mongoose.Schema({
  // 用户名称
  name: {
    type: String, // 字符串类型
    unique: true, // 唯一的
    required: true // 必须的
  },
  // 昵称
  nickname:{
  	type: String
  },
  // 性别
  gender:{
  	type: String
  },
  // 年龄限制范围0-150岁
  age:{
    type: Number,
    min: 0,
    max: 150
  },
  // 个性签名
  signature: String,
  // 用户注册加盐
  salt: String,
  // 用户密码
  password: {
  	type: String,
  	required: true
  },
  /**
   * 用户权限字段
   * 0: 普通用户 normal
   * 1: 已验证用户 verified
   * 2: 职业用户 profession
   * >10: 管理员 admin
   * >50: 超级管理员 super
   */
  role: {
    type: Number,
    default: 0
  },
  meta: {
    create_at: {
      type: Date,
      default: Date.now()
    },
    update_at: {
      type: Date,
      default: Date.now()
    }
  }
});

// 设置索引
UserSchema.index({name: 1});

// 前置存储处理
UserSchema.pre('save', function() {})

// 设置静态方法
UserSchema.statics={}

// 设置模型
UserSchema.methods={}

// 导出用户模型
module.exports = mongoose.model('User', UserSchema);