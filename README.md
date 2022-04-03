# url-api-formatter README

一个将URL格式化为前端配置文件中可能需要的格式的插件

## Features

仅在Javascript, vue, TypeScript, JSON文件下可用

### 格式化URL

最基本的功能，默认格式化方式为：

```
/api/foo/bar ==> const API_FOO_BAR = '/api/foo/bar'
```

### 定义请求方法

针对多个接口对应同一个URL以及其他情况，在url后@加入方法

```
/api/foo/bar@get ==> const GET_API_FOO_BAR = '/api/foo/bar'
```

### 设置公共前缀

配置文件中不需要在每条URL中出现的部分

```
set Prefix ===> '/api'
/api/foo/bar ==> const FOO_BAR = '/foo/bar'
```

### 设置格式化模板：自定义URL格式化的方式

默认模板为： 

```
 `const ##METHOD##KEY##typeAssert = '##url'`
```

模板内可用：

```
##key ( ##KEY ) 小写（大写）的键值
##method ( ##METHOD ) 小写（大写）的方法 
##typeAssert （仅typescript） 类型断言
##url 去除了前缀的url
\n 换行符
```

示例：
```
set Model ==> ##key:{\nurl: '##url', method: '##METHOD',\n}

/api/foo/bar 

==>

api_foo_bar:{
    url: '/api/foo/bar', 
    method: 'GET',
}
```

## Requirements

暂无

## Extension Settings

暂无

## Known Issues

暂无

## Release Notes

### 1.0.0

发布版本

### 1.0.1

写了个很简陋的readme，希望有人能看得懂