const path = require('path'),
  fs = require('fs'),
  webpack = require('webpack');

const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin'),
  uglifyJsPlugin = webpack.optimize.UglifyJsPlugin, // 文件压缩
  WebpackMd5Hash = require('webpack-md5-hash'), // 独立打包样式文件
  ExtractTextPlugin = require('extract-text-webpack-plugin'); // 独立打包样式文件

const srcDir = path.resolve(process.cwd(), 'src');

/**
 * 获取多页面的每个入口文件，用于配置中的entry
 * 注意在同一层级产生产生的数组
 */
function getEntry() {
  var jsPath = path.resolve(srcDir, 'static/js');
  var dirs = fs.readdirSync(jsPath);
  var matchs = [],
    files = {};
  console.log(dirs)
  dirs.forEach(function(item) {
    matchs = item.match(/(.+)\.js$/);
    // console.log(matchs);
    if (matchs) {
      files[matchs[1]] = path.resolve(srcDir, 'static/js', item);
    }
  });
  // console.log(JSON.stringify(files));
  return files;
}
console.log(getEntry())
module.exports = {
  cache: true,
  devtool: 'source-map',
  entry: getEntry(),
  output: {
    path: path.join(__dirname, 'dist/static/js'),
    publicPath: 'dist/static',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  resolve: {
    root: 'src', //绝对路径
    alias: {
      /*jquery: srcDir + 'static/js/libs/jquery.min.js', // js文件中直接 require('jquery') 即可
      core: srcDir + 'static/js/core',
      ui: srcDir + 'static/js/ui'*/
    },
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['', '.js', '.json', '.scss']
  },
  externals: {
    // require('jquery') 是引用CDN自外部模块的
    // 对应全局变量 jQuery
    'jquery': 'jQuery'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: ['babel-loader'] //babel必须放在第一位,不然sourcemap是编译后的代码
        /*}, {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader'
    }, {
      test: /\.coffee$/,
      loader: 'coffee-loader'*/
    }, {
      test: /\.scss$/,
      // loader: 'style!css!postcss!sass?sourceMap',
      loader: ExtractTextPlugin.extract('style','css','postcss','sass?sourceMap')

    /*}, {
      test: /\.css$/,
      loader: 'style!css'*/
    }],
    noParse: [
      path.join(__dirname + srcDir + 'static/vendors/**'), // 不处理vendors下面的文件
    ]
  },
  plugins: [
    new CommonsChunkPlugin('common.js'),
    new ExtractTextPlugin('../styles/[name].css'),
    new WebpackMd5Hash(),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true, //这里的soucemap 不能少，可以在线上生成soucemap文件，便于调试
      mangle: true
    })
  ]
};
