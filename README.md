### 写一些项目中遇到的小坑点
#### vuex
项目中有遇到引用了vuex的值并进行存储的地方，要注意是否需要拷贝
深拷贝与浅拷贝的区别：指针
尽量避免使用=，Array.from()、Object.assign()复制数组都是浅拷贝，修改vuex内的数据同样会使已存储的数据发生改变
```
let a = [{name: 'rose'},{name:'gary'}]
let b = Array.from(a)
b[0].name = 'sam'
//打印a会发现 a = [{name: 'sam'},{name:'gary'}],同理 使用Object.assign()进行同样的操作，也会得出同样的结果
```
### 项目配置
在一些低版本项目中使用... 拓展运算符(es6或者其他的新语法)报错时,无法解析新语法，最快捷方法:可以在项目中添加.babelrc文件，并添加以下配置
  ```
  {
    "presets": [
      "stage-2"
    ]
  }
  ```
