# mongoose相关知识

### 类型有一下几种
```
String // 字符串类型
Number //  数字类型
Boolean | Bool // 布尔类型true or false
Array // 数组类型
Buffer // Buffer类型
Date // 日期类型
ObjectId | Oid // 自增类型
Mixed
```

### 定义数据模型
```
let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({...});
```

### 创建一个模型
```
let User = mongoose.model('User', userSchema);
```

### 实例方法自定义
```
let userSchema = new mongoose.Schema({...});
// assign a function to the "methods" object of our animalSchema
userSchema.methods.findSimilarTypes = function () {
  // 方法内容 
}
```

### 静态方法
```
userSchema.statics.findByName = function () {
  // 方法内容 
}
```

### 索引设置
```
userSchema.index({name:1})

```