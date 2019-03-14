# Web-SDK

Web-SDK 是紫荆云平台Web端Javascript版本SDK。Web-SDK 可以帮助您在十分钟内快速搭建基于浏览器的音视频应用。Web-SDK 使用WebRTC协议构建音视频通话服务，让您轻松应对一对一、多对多音视频通话及实时数据传输等复杂应用场景。
 
# 问题反馈
* 任何关于SDK的问题，您可以在[Issues](https://github.com/zijingcloud/Web-SDK/issues/new)中反馈。

# 安装
在html文件中用<script> 引用 vcrtc.js 即可。
`  <script src="vcrtc.js"></script>`

# 使用
 参见《Javascript接口API.docx》文档

# demos使用
demos下面每个文件夹代表一个Web应用，将应用挂在 Web Server 下，然后直接访问 Web 页面即可。 由于浏览器限制，非localhost域名访问时需要使用 `https://` 方式访问。

例子：

> cd demo
>
> python -m SimpleHTTPServer 9998

接下来您可以使用 `http://localhost:9998/`访问demo.

# 需求
 待完善

# API

> // 创建RTC实例
>
> var rtc =  new ZjRTC();
>




