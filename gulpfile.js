'use strict';
/**
 * 这是gulp自动化构建工具task执行配置文件
 */
const gulp = require('gulp'),
  $ = require('gulp-load-plugins')(), //自动加载gulp开头的插件
  lazypipe = require('lazypipe'),
  spritesmith = require('gulp.spritesmith'),
  browserSync = require('browser-sync').create(),
  webpack = require('webpack'),
  webpackConfig = require('./webpack.config.js');

// 全局配置
const CFG = {
  // 路径配置
  src: 'src/',
  sass: 'src/static/sass/**/*.{scss,sass}', // sass文件
  styles: '**/*.css', // css文件
  fonts: 'src/static/sass/**/*.{eot,svg,ttf,woff}', // 字体文件
  svgSprite: 'src/static/images/svg/**/*.svg', // svg图标
  sprite: 'src/static/images/sprite/**/*.png', // image图标
  js: ['src/**/*.{js,coffee}','!src/static/vendors/**/*.{js,coffee}'], // js文件
  images: 'src/static/images/**/*.{jpg,png,gif,ico,svg}', // 多文件支持
  html: '**/*.{html,htm,shtml,shtm}', // 多文件支持
  dist: 'dist/'
}

// scss文件编译和相关配置
gulp.task('styles', () => {
  return gulp.src(CFG.sass)
    .pipe($.sourcemaps.init())
    .pipe($.if(/\.scss$/, $.sass({ precision: 10 })
      .on('error', $.sass.logError)))
    .pipe($.if(/\.css$/, $.autoprefixer()))
    .pipe($.if(/\.css$/, $.sourcemaps.write('.')))
    .pipe($.size({
      title: 'styles',
      showFiles: true
    }))
    .pipe($.changed(CFG.src+'static/styles'))
    .pipe(gulp.dest(CFG.src+'static/styles'))
    .pipe($.notify({ message: 'SASS文件编译完成!' })) // 编译提示信息
    .pipe(browserSync.stream())
});
gulp.task('styles:build', () => {
  return gulp.src(CFG.sass)
    .pipe($.sourcemaps.init())
    .pipe($.if(/\.scss$/, $.sass({ precision: 10 })
      .on('error', $.sass.logError)))
    .pipe($.if(/\.css$/, $.autoprefixer()))
    .pipe($.if(/\.css$/, $.sourcemaps.write('.')))
    .pipe($.size({
      title: 'styles',
      showFiles: true
    }))
    .pipe($.changed(CFG.dist+'static/styles'))
    .pipe(gulp.dest(CFG.dist+'static/styles'))
    .pipe($.notify({ message: 'SASS文件编译完成!' })) // 编译提示信息
    // .pipe(browserSync.stream())
});

// 将图片拷贝到目标目录并做压缩处理
gulp.task('images:build', () => {
  return gulp.src([CFG.images,'!'+ CFG.sprite,'!'+ CFG.svgSprite])
    // .pipe($.imagemin()) // 图片压缩
    .pipe($.size({
      title: 'images',
      showFiles: true
    }))
    .pipe($.changed(CFG.dist+'static/images'))
    .pipe(gulp.dest(CFG.dist+'static/images'))
    .pipe($.notify({ message: '图片处理完成!' })) // 编译提示信息
    .pipe(browserSync.stream())
});
// svg雪碧图纸制作 ??有待配置
gulp.task('sprite', () => {
  return gulp.src(CFG.images)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.scss',
      cssFormat: 'scss'
    }))
    .pipe($.changed('dist/css'))
    .pipe(gulp.dest('dist/css'))
    .pipe($.notify({ message: 'sprite图片处理完成!' })) // 编译提示信息
    .pipe(browserSync.stream())
});

// svg雪碧图纸制作 ??有待配置
gulp.task('svgSprite', () => {
  return gulp.src(CFG.svgSprite)
    .pipe($.svgSprite({
      shape: {
        spacing: {
          padding: 5
        }
      },
      mode: {
        css: {
          dest: CFG.dist,
          layout: "diagonal",
          sprite: CFG.src + 'static/images/sprite.svg',
          bust: false,
          render: {
            scss: {
              dest: CFG.src + "static/sass/sprite/_sprite_svg.scss",
              template: ""
            }
          }
        }
      },
      variables: {
        mapname: "svg"
      }
    }))
    .pipe($.changed(CFG.src+'static/images'))
    .pipe(gulp.dest(CFG.src+'static/images'))
    .pipe($.notify({ message: 'SVG Sprite图片处理完成!' })) // 编译提示信息
    .pipe(browserSync.stream())
});
gulp.task('pngSprite', ['svgSprite'], function() {
  return gulp.src(CFG.svgSprite)
    .pipe($.svg2png())
    .pipe($.size({
      showFiles: true
    }))
    .pipe($.changed(CFG.src+'static/images'))
    .pipe(gulp.dest(CFG.src+'static/images'));
});

// js文件操作
gulp.task('js', () => {
  return gulp.src([CFG.js])
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.changed(CFG.src))
    .pipe($.jshint()) // js语法校验
    .pipe($.jshint.reporter('default'))
    .pipe($.notify({ message: 'JS校验完成!' })) // 编译提示信息
    .pipe(browserSync.stream())
});
gulp.task('js:build', () => {
  return gulp.src([CFG.js])
    /*.pipe($.babel({
      presets: ['es2015']
    }))*/
    .pipe($.jshint()) // js语法校验
    .pipe($.jshint.reporter('default'))
    // .pipe($.uglify()) // 压缩js文件
    // .pipe($.rename({ suffix: '.min' })) // 文件重命名
    .pipe($.size({
      title: 'JS',
      showFiles: true
    }))
    .pipe($.changed(CFG.dist))
    .pipe(gulp.dest(CFG.dist))
    .pipe($.notify({ message: 'JS处理完成!' })) // 编译提示信息
    .pipe(browserSync.stream())
});

// html文件操
gulp.task('html:build', () => {
  return gulp.src([CFG.src + CFG.html, '!' + CFG.src + 'static/' + CFG.html])
    // useref分析html文件中带有build注释的css,js块
    /*// 这里可以把scss文件替换css直接插入块级通过useref处理scss文档
      .pipe($.useref({
        searchPath: CFG.src + 'static',
      }, lazypipe()
      .pipe($.sourcemaps.init)
      // 编译SCSS文件
      .pipe(function() {
        return $.if(/\.scss$/, $.sass({
          precision: 10
        }).on('error', $.sass.logError));
      })
      .pipe(() => {
        // CSS前缀和压缩CSS
        return $.if(/\.css$/, $.autoprefixer('> 0.2%'), $.cleanCss())
      })
    ))*/
    .pipe($.useref({searchPath: CFG.src, basePath:'/static'}))
    .pipe($.if(/\.css$/, $.cleanCss())) // 压缩CSS
    // .pipe($.if(/\.js$/, $.uglify())) // 压缩JS
    .pipe($.if(/\.(css|js)$/, $.rev())) // 打MD5版本
    .pipe($.revReplace()) // 替换改变文件MD5版本号
    /*.pipe($.rev.manifest({
        base: CFG.dist + 'config/configRev.js',
        merge: true // merge with the existing manifest (if one exists)
    }))*/
    // 这里还可以对html进行压缩
    .pipe($.changed(CFG.dist)) //将文件写入dist目录
    .pipe(gulp.dest(CFG.dist)) //将文件写入dist目录
    .pipe($.notify({ message: 'html拷贝完成!' })) // 编译提示信息
    .pipe(browserSync.stream())
})

// 处理字体
gulp.task('fonts', () => {
  return gulp.src(CFG.fonts)
    .pipe($.changed(CFG.src + 'static/styles')) // 将字体文件写入dist目录
    .pipe(gulp.dest(CFG.src + 'static/styles')) // 将字体文件写入dist目录
    .pipe($.notify({ message: '字体文件处理完毕!' })) // 编译提示信息
    .pipe(browserSync.stream())
});
gulp.task('fonts:build', () => {
  return gulp.src(CFG.fonts)
    .pipe($.changed(CFG.dist + 'static/styles')) // 将字体文件写入dist目录
    .pipe(gulp.dest(CFG.dist + 'static/styles')) // 将字体文件写入dist目录
    .pipe($.notify({ message: '字体文件处理完毕!' })) // 编译提示信息
    .pipe(browserSync.stream())
});

// webpack 配置对js进行操作
gulp.task("webpack:js", () => {
  webpack(webpackConfig, (err, stats)=>{
    if(err){ throw new $.util.PluginError("webpack:build-js", err);}
    $.util.log("[webpack:build-js]", stats.toString({
        colors: true
    }));      
  });
});

// 清理操作
gulp.task('clean', () => {
  return gulp.src(CFG.dist)
    .pipe($.clean())
    .pipe($.notify({ message: 'dist目录删除完毕!' }));
});

// 监听文件变化并执行对应的task
gulp.task('watch', () => {
  // 监听文件变化并执行对应的task
  gulp.watch([CFG.sass], ['styles']);
  gulp.watch([CFG.js], ['js']);
  // gulp.watch([CFG.images], ['images']);
  gulp.watch([CFG.fonts], ['fonts']);

  // 监听所有位在dist目录下的文件，一旦有更动，便进行重启服务器后刷新阅览器
  // gulp.watch([CFG.src + '**']).on('change',browserSync.reload);
});

gulp.task('watch:build', () => {
  // 监听文件变化并执行对应的task
  gulp.watch([CFG.src + CFG.html], ['html:build']);
  gulp.watch([CFG.js], ['js:build']);
  gulp.watch([CFG.images], ['images:build']);
  gulp.watch([CFG.fonts], ['fonts:build']);

  // 监听所有位在dist目录下的文件，一旦有更动，便进行重启服务器后刷新阅览器
  // gulp.watch([CFG.src + '**']).on('change',browserSync.reload);
})

// 开发服务器连接操作
gulp.task('nodemon', () => {
  return $.nodemon({
      script: CFG.src + 'index.js',
      ext: 'html htm js json css jpg png gif eot svg ttf woff', // 监听变化的扩展名文件 htm shtml shtm js json css scss jpg png gif eot svg ttf woff
      ignore: [
        '.git',
        '.DS_Store',
        '.sass-cache',
        'doc/',
        'node_modules/'
      ],
      env: {
        'NODE_ENV': 'development'
      }
    })
    .on('restart', () => {
      console.log('重新启动!')
    })
});
gulp.task('nodemon:build',['js:build', 'html:build'], () => {
  return $.nodemon({
      script: CFG.dist + 'index.js',
      ext: 'html htm js json css jpg png gif eot svg ttf woff', // 监听变化的扩展名文件 htm shtml shtm js json css scss jpg png gif eot svg ttf woff
      ignore: [
        '.git',
        '.DS_Store',
        '.sass-cache',
        'doc/',
        'node_modules/'
      ],
      env: {
        'NODE_ENV': 'development'
      }
    })
    .on('restart', () => {
      console.log('重新启动!')
    })
});

// 阅览器同步刷新
gulp.task('browserSync', ['nodemon'], () => {
  browserSync.init({
    // server: CFG.src, // 静态服务路径
    proxy: "http://localhost:4000", // 代理服务路径
    // files: [CFG.src + '/static/**/*.*', CFG.src + 'views/**/*.*'],
    files: [CFG.src + '**'],
    browser: 'google chrome',
    notify: false,
    port: 5000
  });
});

gulp.task('browserSync:build', ['nodemon:build'], () => {
  browserSync.init({
    // server: CFG.src, // 静态服务路径
    proxy: "http://localhost:4000", // 代理服务路径
    // files: [CFG.src + '/static/**/*.*', CFG.src + 'views/**/*.*'],
    files: [CFG.dist + '**'],
    browser: 'google chrome',
    notify: false,
    port: 5000
  });
});

// 构建开发时默认的任务
gulp.task('default', ['js', 'styles', 'fonts', 'watch', 'nodemon', 'browserSync']);

// 开发完成后构建的任务
gulp.task('build', ['js:build', 'html:build', 'fonts:build', 'images:build', 'nodemon:build','browserSync:build','watch:build']);