'use strict';
/**
 * 全局配置参数
 */
module.exports = {
    host: '127.0.0.1',
    // 服务器端口号
    port: process.env.PORT || 4000,
    
    // Cookie码
    cookieSecret: 'riLbqTemd3NAdUBwUU7nfsuteqwapN',
    
    // 数据库配置设置
    db: {
        connect: 'mongodb://127.0.0.1/colpu',
        opts: null
    }
};