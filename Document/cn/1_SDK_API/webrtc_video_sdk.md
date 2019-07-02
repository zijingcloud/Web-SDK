# 介绍
这是云会中管理和Web入会的JavaScript API文档。基于Web的第三方应用程序可通过这个API对云平台上正在召开的会议或讲堂进行外呼、踢人、静音、锁会、Layout、录播等灵活的会中管理，也可以通过API 实现基于WebRTC的音视频通讯和屏幕/应用/文档等的共享。整个API包含客户端控制、会议控制、回调函数等三大部分，所有API都是通过一个称为“RTC”的对象访问的。

```
	var rtc = new ZjRTC();
```

## 音视频呼叫
### 加入会议：makeCall(node,conference,name,bandwidth,call_type)
​		加入会议，将通过WebRTC方式加入视频会议，呼叫成功将触发OnSetup回调函数。

主要参数

| node       | 会议服务器的主机名或IP地址，请调用apiServer/api/v3/meet/checkJoin.shtml获取，参见《会中管理文档API》 |
| ---------- | ------------------------------------------------------------ |
| conference | 会议室地址或短号                                             |
| name       | 会议中显示的本人名字                                         |
| bandwidth  | 上下行带宽，可以为空(null)                                   |
| call_type  | 呼叫类型 可选  默认通过WebRTC 进行视频呼叫                   |
|            | “presentation” —只接收演示（辅流）的WebRTC呼叫               |
|            | “screen” — 只屏幕共享的WebRTC 呼叫                           |
|            | “audioonly” — 纯音频 WebRTC 呼叫                             |
|            | “recvonly” — 只收不发的 WebRTC 呼叫                          |

返回值

​		无。成功将触发onSetup 回调函数。需要执行完成会议链接命令connect(pin, extension)；

### 完成会议连接命令：connect(pin, extension)

​		用于完成连接的初始化处理。在通过onSetup回调函数获取初始信息后，必须调用该函数。如果会议室设置了密码保护，PIN这个会议密码参数不能为空（（如果入会密码不正确，onSetup将被再次调用）。

主要参数

| pin       | 入会密码。如果会议室没有设置入会密码，参数为null |
| --------- | ------------------------------------------------ |
| extension | 如直拨的会议室，该参数应为null                   |

返回值

​		无。 执行成功将触发onConnect回调函数；如果提供的入会密码不正确，将再次触发onSetup回调函数。

## 开关本地摄像头

### 设置命令：muteVideo(setting)

对本地摄像头执行关闭或打开的操作。rtc.mutedVideo = false; 开启本地摄像头

主要参数

| 参数    | 含义                                      |
| ------- | ----------------------------------------- |
| setting | true:关闭本地摄像头  false:开启本地摄像头 |

返回值

​	更新 rtc.mutedVideo 状态为 true。

## 开关本地麦克风

### 设置命令：muteAudio(setting)

对本地麦克风执行关闭或打开的操作。rtc.mutedAudio = false; 开启本地摄像头

主要参数

| 参数    | 含义                                      |
| ------- | ----------------------------------------- |
| setting | true:关闭本地麦克风  false:开启本地麦克风 |

返回值

​	更新 rtc.mutedAudio 状态为 true。

## 切换本地麦克风

### 设置变量：rtc.audio_source

通过传入不同的audio_source来切换麦克风

###audio_source获取方法

基于chrome浏览器端通过navigator.mediaDevices.enumerateDevices()方法获取到媒体设备相应指定麦克风的deviceId再赋值给audio_source

> navigator.mediaDevices.enumerateDevices() 
>
> 参考地址：https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/enumerateDevices

![image-20190702084252931](/Users/blue/Library/Application Support/typora-user-images/image-20190702084252931.png)

### 切换本地音频输出

有问题

### 切换本地麦克风

#### 设置变量：rtc.video_source

通过传入不同的video_source来切换麦克风

#### video_source获取方法

基于chrome浏览器端通过navigator.mediaDevices.enumerateDevices()方法获取到媒体设备相应指定麦克风的deviceId再赋值给video_source

> navigator.mediaDevices.enumerateDevices() 
>
> 参考地址：https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/enumerateDevices

![image-20190702084252931](/Users/blue/Library/Application%20Support/typora-user-images/image-20190702084252931.png)

### 添加音视频/演示信道：addCall(call_type)

添加视频、演示或屏幕共享至现有会议中。添加视频一般在当前rtc.call_type为none时调用()。

主要参数

| 参数      | 描述                                           |
| --------- | ---------------------------------------------- |
| call_type | “presentation” —只接收演示（辅流）的WebRTC呼叫 |
|           | “screen” — 只屏幕共享的WebRTC 呼叫             |
|           | “audioonly” — 纯音频 WebRTC 呼叫               |
|           | “recvonly” — 只收不发的 WebRTC 呼叫            |

## 会议控制

### 群发文字聊天信息：sendChatMessage(message)

向会议中的所有参会者发送文字聊天消息(只适用于WebRTC)

主要参数

| 参数    | 含义           |
| ------- | -------------- |
| message | 发送的文字信息 |

返回值



### 离开会议室:disconnect(referral);

断开与云平台的连接，离开会议室

| 参数     | 含义                                 |
| -------- | ------------------------------------ |
| referral | true 不清除辅流；false/none 清除辅流 |

返回值

无

### 开始/停止屏幕共享：present(call_type)

开始/停止屏幕共享（chrome73以上 或者 firefox 自带屏幕共享，无需安装插件；其余浏览器需要安装插件）

| 参数      | 含义                                  |
| --------- | ------------------------------------- |
| call_type | “screen”:开始屏幕共享；null：停止共享 |

返回值

无

### 获取媒体流统计信息：getMediaStatistics()

用于获取媒体流的统计信息。此方法只有Chrome浏览器支持。

主要参数

无

返回值

```
incoming:{
	audio:{bitrate: "unavailable",
			codec: "opus",
			packets-lost: "0",
			packets-received: "1270",
			percentage-lost: 0}
},
outgoing:{
	audio:{
		bitrate: "unavailable",
		codec: "opus",
		echo-level: "0.106884",
		packets-lost: "22",
		packets-sent: "1271",
		percentage-lost: 0
	},
	video_big:{
		bitrate: "unavailable",
		codec: "H264",
		configured-bitrate: "124.3kbps",
		frameRate: "20",
		packets-lost: "45",
		packets-sent: "522",
		percentage-lost: 0,
		resolution: "480x270"
	},
	video_smail:{
		bitrate: "unavailable",
		codec: "H264",
		configured-bitrate: "124.3kbps",
		frameRate: "15",
		packets-lost: "19",
		packets-sent: "412",
		percentage-lost: 0,
		resolution: "320x180"
	}
}
```

###外呼参会者命令：dialOut(destination,protocol, role, cb, params)

​		从会议室将指定参会者外呼入会，只有主持人才可以使用此方法。

**主要参数**

| destination | 拟外呼的参会者地址或短号                                     |
| ----------- | ------------------------------------------------------------ |
| protocol    | 目前支持的协议有 “sip”, “h323”, “mssip”，“phone”,“auto”      |
| Role        | 角色。“guest”：访客；“chair”:主持人。默认值为”chair”         |
| cb          | 外呼后执行的回调函数。系统将给回调函数传递一个result对象，对象中包含一组（一般是一个）云平台创建的准参会者对应的唯一标识uuid |
| params      | params是以下字段的任意组合，都是可选项:  <br>   presentation_uri:“rtmp”第二路视频（演示流）推送目的url<br>   streaming:是否是流媒体，用于流媒体直播   <br>   remote_display_name 显示在会议参会者清单中的名字 |

**返回值**

​		如果没有指定回调函数参数cb(为空)，调用将阻塞直至返回一个result对象。如果外呼初始化成功，返回值是云平台生成的参会者uuids列表，在绝大部分情况下，一次外呼只会产生一个新的参会者uuid,除否云平台上配置了fork呼叫。新生成的参会者会立即在参会者列表中出现，service_type为”connecting”,呼叫建立成功，参会者的service_type将变为正常的“conference”；如果被呼终端拒绝了本呼叫或者30秒内没有收到任何应答，云平台将从参会者列表中删除该准参会者。

### 锁会/解锁命令：setConferenceLock(setting)

​		锁定或解锁进行中的会议，会议锁定时访客将不能直接入会。

| 参数    | 含义                  |
| ------- | --------------------- |
| setting | true:锁定  false:解锁 |

**返回值**

无

### 静音全部访客设置：setMuteAllGuests(setting)

​	设置“静音所有访客”或取消 “静音所有访客”的设置。

| 参数    | 含义                                          |
| ------- | --------------------------------------------- |
| setting | true:设置所有访客静音  false:取消所有访客静音 |

**返回值**

无

###指定某参会者静音：setParticipantMute(uuid,setting)
设置“静音所有访客”或取消 “静音所有访客”的设置。

| 参数    | 含义                                          |
| ------- | --------------------------------------------- |
| setting | true:设置所有访客静音  false:取消所有访客静音 |
| uuid    | 参会者的唯一标识                              |

**返回值**

无

所有参会者列表中的用户都会改变状态，调用此方法时触发系统事件onParticipantUpdate 

### 角色设置：setRole(uuid, setting)

变更由uuid标识的参会者在会议中的角色。

**主要参数**

|  参数   | 含义                                             |
| :-----: | ------------------------------------------------ |
|  uuid   | 用于唯一标识参会者                               |
| setting | 指定参会者的新的角色。chair:主持人    guest:访客 |

**返回值**

无。参会者状态的改变将通过触发onParticipantUpdate 回调函数反应到参会者列表中。

### 将等待中的参会者放进会议室：unlockParticipant(uuid)

将已经被锁定会议的会议室指定参会者(访客)放进会议中。

**主要参数**

| 参数 | 含义               |
| :--: | ------------------ |
| uuid | 用于唯一标识参会者 |

**返回值**

无。参会者状态的改变将通过触发onParticipantUpdate 回调函数反应到参会者列表中。

###修改屏幕布局命令：updateLayout(layout,glayout)

设置屏幕布局, 讲堂模式时主持人用Layout， 访客用Glayout； 会议室模式只需要设置Layout即可。

**参数**

| Layout  | (主持人)视频布局  1:0 一个大屏 ， 4:0 等分屏 ， 1:7  1大7小布局      1:21  1大21小布局 |
| ------- | ------------------------------------------------------------ |
| Glayout | 访客布局  1:0 一个大屏 ， 4:0 等分屏 ， 1：7  1大7小布局      1:21  1大21小布局 ，    2:21  2大21小布局 |

**返回值**

无

### 修改与会者名称：overlayTextUpdate(uuid, newName)

设置与会者的显示名。

**参数**

|  参数   | 含义               |
| :-----: | ------------------ |
|  uuid   | 用于唯一标识参会者 |
| newName | 与会新的显示名称   |

**返回值**

无

### 禁画/取消禁画：setParticipantVideoMute(uuid, setting)

禁止某位参会者画面，使其他参会者无法看到该参会者的画面。

参数

| 参数    | 含义                          |
| ------- | ----------------------------- |
| uuid    | 参会者的唯一标识              |
| setting | true:设置禁画  false:取消禁画 |

**返回值**

无

所有参会者列表中的用户都会改变状态，调用此方法时触发系统事件onParticipantUpdate 

### 禁音/取消禁音：setParticipantMute(uuid, setting)

禁止某位参会者的音频，使该参会者无法再发出声音。

参数

| 参数    | 含义                          |
| ------- | ----------------------------- |
| uuid    | 参会者的唯一标识              |
| setting | true:设置禁音  false:取消禁音 |

**返回值**

无

所有参会者列表中的用户都会改变状态，调用此方法时触发系统事件onParticipantUpdate 

### 闭音/取消闭音：setParticipantMutear(uuid, setting) 

闭音某位参会者，使该参会者无法听到其他参会者的交流的声音。

参数

| 参数    | 含义                          |
| ------- | ----------------------------- |
| uuid    | 参会者的唯一标识              |
| setting | true:设置闭音  false:取消闭音 |

**返回值**

无

所有参会者列表中的用户都会改变状态，调用此方法时触发系统事件onParticipantUpdate 

### 取消延时/恢复延时：setParticipantDelayPlay(uuid, setting) 

针对延时会议的情况，取消某人的延时效果和恢复某人的延时

参数

| 参数    | 含义                          |
| ------- | ----------------------------- |
| uuid    | 参会者的唯一标识              |
| setting | true:取消延时  false:恢复延时 |

**返回值**

无

所有参会者列表中的用户都会改变状态，调用此方法时触发系统事件onParticipantUpdate 

### 结束会议：disconnectAll()

该命令由主持人用于结束会议，将所有与会者（包含自身）踢出会议室。

**参数**

无

**返回值**

无

## 回调函数

