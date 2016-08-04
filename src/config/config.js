'use static';
/**
 * 全局配置参数
 */
module.exports = {
   
    // 服务器端口号
    port: process.env.PORT || 4000,
    
    // Cookie码
    cookieSecret: 'riLbqTemd3NAdUBwUU7nfsuteqwapN',
    
    // 数据库配置设置
    db: {
        // 开发时用的数据库
        'development': {
            connect: 'mongodb://127.0.0.1/colpu'
        },
        // 生产时用的数据库
        'production': {
            connect: 'mongodb://127.0.0.1/colpu' //有待修改
        },
        opts: {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        }
    }
};