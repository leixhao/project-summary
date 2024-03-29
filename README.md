## 写一些项目中遇到的小坑点

### 一些小的问题
img如何判断图片是否加载完成
两种方法，img的complete属性需要监听判断；下面是个onload 的方法，加载完成会自动触发(原声onload事件 vue中@load)
### iview组件使用注意事项

#### iview tabs层级显示问题

iview组件中当嵌套使用 Tabs时，需要在Tabs中指定 name 属性来区分层级，然后在TabPane 中设置 tab 属性指向对应 Tabs 的 name 字段。
参考：<https://blog.csdn.net/wang_xiao_ye/article/details/90023979>

### iview问题

最近一个项目中使用了iview，其中时间选择器点击左边按钮会出现左侧时间不会联动的情况，本来是猜想可能是因为项目中使用了element的原因，可能会有什么冲突，但是将element的时间组件注释后，还是无法解决问题。
将iview的版本回退到3.4.1之后，问题解决，猜想，可能是iview3.5.4版本组件本身问题？不可知晓。

### iview tooltip文字提示数字或特殊字符不会换行问题

使用render函数方式写tooltip，在span中增加样式whiteSpace: "pre-wrap",wordWrap: 'break-word'
eg:

```
render: (h, params) => {
  let texts = params.row.iconPath;
  if (texts) {
    if (texts.length > 17) {
      texts = texts.slice(0, 16) + "..."; // 进行数字截取
    } else {
      texts = texts;
    }
  }
  return h("div", [
    h(
      "Tooltip",
      {
        props: {
          placement: "right-end",
          transfer: true,
        },
      },
      [
        texts,
        h(
          "span",
          {
            slot: "content",
            style: {
              whiteSpace: "pre-wrap",
              wordWrap: 'break-word'
            },
          },
          params.row.iconPath
        ),
      ]
    ),
  ]);
},
```
### 字符串隐式转换问题
项目中有个地方需要对提交信息做空值判断，并删除空值字段
其中有个判断0的参数，使用了 == 双等 与 ''空字符串进行判断
在判断中，双等判断会进行隐式转换，0被隐式转换为false，''空字符串也被转换为false，所以出了bug(0==''，成了true)
这种情况下判断必须使用===三等进行判断

### vuex

项目中有遇到引用了vuex的值并进行存储的地方，要注意是否需要拷贝
深拷贝与浅拷贝的区别：指针
尽量避免使用=，Array.from()、Object.assign()复制数组都是浅拷贝，修改vuex内的数据同样会使已存储的数据发生改变

```
let a = [{name: 'rose'},{name:'gary'}]
let b = Array.from(a)
b[0].name = 'sam'
//打印a会发现 a = [{name: 'sam'},{name:'gary'}],同理 使用Object.assign()进行同样的操作，也会得出同样的结果
```

写一个深拷贝方法解决

```
const deepClone = (obj) => {
  // 如果是字符串
  if(typeof(obj) == 'string'){
    return ''+obj
  }
  //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
  var objClone = Array.isArray(obj) ? [] : {};
  //进行深拷贝的不能为空，并且是对象或者是
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}
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

### go.js使用

当一个选项可以被拖动到不同被选区域时，判断条件会以一个新的基准判断。如：key的判断，两个区域第一次出现的相同选项key值可能会相同。
go.js 中的每个元素中会有一个维护标识 (obj.selectedNode.data.__gohashid)

### vue1.0

vue1.0 for循环嵌套，内层循环使用外层循环$index,需要$parent.$index

### 前后端不分离

在后端集成前端项目的时候，需要将前后端请求地址及接口前缀匹配一致
vue项目中配置两个跨端接口前缀时，可能会存在当前服务器地址之外的另一个服务接口请求失败的情况
解决方案：
后端做了另一个接口地址的请求代理，接收请求并转发
其他可能方案：
将接口前缀提出来单独写成js直接引入到index.html中，并在接口打包处做修改。

### 集成登陆

在请求拦截处添加未登录状态拦截，并且在退出登录添加代码
两处都是请求sso地址

```
if (data.status == 401) {
  // console.log(`${data.data.service}${document.location.origin}${data.redirect}${document.location.href}`);
  location.href = `${data.data.service}${document.location.origin}${data.data.redirect}${document.location.href}`;
} 
loginOut().then(res => {
  location.href = `${res.data.service}${document.location.origin}${res.data.redirect}${document.location.href}`;
});
```

## 写一些知识点

### vue的模板编译原理

分为三步：

```
1、将模板字符串转换为element ASTs树(解析器)
2、对ASTs中的静态节点进行标记(优化器)
3、使用ASTs树生成render函数代码字符串(代码生成器)
```

### 前端模拟键盘按键点击

网上大多百度出来的键盘点击API大多已经在废弃的状态中
以下是MDN中最新的使用方式
```
var a = new KeyboardEvent("keydown", { detail: 1, view: window });
Object.defineProperty(a, "keyCode", { value: key });
document.dispatchEvent(a);
```

### 关于前端iframe嵌入第三方页面，且需无感登陆(携带cookie信息)的问题(无法修改第三方源码或增加接口，且无法设置如白名单等)
#### 问题细化
1、多用户情况下实现免登陆，如何保证使用相同且不过期的cookie?
```
  (无感登陆时，想实现使用同一个账号进行登陆，且多用户访问时，cookie不会失效导致重新登录)
  解决方案：后端用统一的账号模拟登陆，并将登陆信息进行缓存，同时要通过定时任务定期更新缓存cookie信息
```

2、iframe嵌入某些第三方页面时，目标页面的点击劫持的安全策略如何跳过？
```
  (问题描述：点击劫持是指现在的网络环境下，有的网站为了防止其他网站 使用 iframe嵌入自己的网站，使用的安全策略CSP、X-Frame-Options、framekiller,CSP、X-Frame-Options两者都是服务端通过设置 HTTP 响应头来声明 CSP 和X-Frame-Options)
  解决方案：通过nginx做中间代理，对目标页面相应头header进行调整
```

3、后端将cookie信息返回前端，前端如何携带cookie信息请求第三方目标地址？
```
  暂时无法解决，原因如下：浏览器同源策略，cookie无法跨域设置
  可行的解决方案：
    1、第三方配合完成，提供设置远程cookie的rest接口。(需第三方配合)
    2、主服务和第三方服务用用同一个nginx做代理，保持协议、IP、端口一致，通过location去路由不同的服务。(需第三方配合)
```
#### 问题总结
```
1、嵌入同源(相同协议、域名、端口)的某个页面没有问题(即使需要登录，浏览器的同源策略也允许访问cookie)
eg：
即在 网站A 比如 https://a.com/a 中 使用iframe 内嵌访问 网站B 比如 https://b.com/b   会导致 网站B登录失效
如果把 网站B域名改成  https://a.com/b  即在 网站A 比如 https://a.com/a 中 使用iframe 内嵌访问 网站B 比如 https://a.com/b是可以的
2、嵌入第三方无登录页面，如果第三方页面没有登陆，只需解决安全策略即可
```
