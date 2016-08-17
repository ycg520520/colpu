'use strict';
module.exports = {
  /**
   * [autoLoad 自动加载文件]
   * @param  {string} path [指定要加载的文件夹路径]
   */
  autoLoad: function(path) {
  	(function walk(path){
	    fs
	      .readdirSync(path)
	      .forEach(function(file) {

	        let newPath = path + '/' + file,
	        		stat = fs.statSync(newPath);

	        if (stat.isFile() && /(.*)\.(js|coffee)/.test(file)) {
	          require(newPath);
	        } else if (stat.isDirectory()) {
	          walk(newPath);
	        }
	      });
	  })(path);
	}

};
