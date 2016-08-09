const path = require('path'),
      fs = require('fs'),
      webpack = require('webpack');

const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"),
      uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const srcDir = path.resolve(process.cwd(), 'src');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var jsPath = path.resolve(srcDir, 'static/js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    console.log(dirs)
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        // console.log(matchs);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'static/js', item);
        }
    });
    // console.log(JSON.stringify(files));
    return files;
}

module.exports = {
    cache: true,
    devtool: "source-map",
    entry: getEntry(),
    output: {
        path: path.join(__dirname, "dist/static/js"),
        publicPath: "dist/static/js",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    resolve: {
        alias: {
            /*jquery: srcDir + "static/js/libs/jquery.min.js",
            core: srcDir + "static/js/core",
            ui: srcDir + "static/js/ui"*/
        }
    },
    plugins: [
        new CommonsChunkPlugin('common.js'),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};