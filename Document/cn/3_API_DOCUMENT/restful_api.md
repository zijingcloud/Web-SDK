# 简介

本文档描述的是会中管理的REST API。可以通过这个API实现对云平台上正在召开的会议或讲堂实现外呼、踢人、静音、锁会、Layout、录播等灵活的会中管理。

# API的使用

## 验证用户信息并获取会议服务器地址

该接口用于验证用户入会信息是否合法，返回验证成功后的入会信息，其中mcuHost为目标会议节点地址，后续会议请求请使用该地址。

请求地址：https://apiServer/api/v3/meet/checkJoin.shtml

请求方式：POST

请求参数：

| **参数类别**    | **参数名称** | 类型                                          | **注释**          | 长度 | 是否必填 | **备注说明** |
| --------------- | ------------ | --------------------------------------------- | :---------------- | ---- | -------- | ------------ |
| 请求参数(Body)  | joinAccount  | varchar                                       | 入会短号/通讯地址 | 60   | 是       |              |
| joinPwd         | varchar      | 入会认证密码,<br />点对点呼叫时，此参数无效。 | 15                | 否   |          |              |
| participantName | varchar      | 入会后显示姓名                                | 50                | 是   |          |              |

响应参数：

| **参数名称**    | **类型** | **注释**                                                     | **长度** |
| --------------- | -------- | ------------------------------------------------------------ | -------- |
| isDot           | Boolean  | 是否是点对点呼叫:true、false                                 |          |
| sipkey          | Varchar  | 会议室/用户入网/终端入网短号                                 |          |
| alias           | Varchar  | 通讯地址,格式为email格式                                     |          |
| password        | Varchar  | 认证密码,点对点呼叫时，此参数默认为空字符.                   |          |
| participantName | Varchar  | 参会者显示名称                                               |          |
| roleType        | Varchar  | 参会者角色类型：<br />主持人(host)、访客(guest),点对点呼叫时，此参数默认为空字符. |          |
| mcuHost         | Varchar  | 资源池请求地址                                               |          |
| companyId       | Int      | 所属企业ID                                                   |          |
| isRecord        | Boolean  | 是否开通录制权限,点对点呼叫时，此参数默认为false             |          |
| isLive          | Boolean  | 是否开通直播权限,点对点呼叫时，此参数默认为false             |          |
| conferenceName  | Varchar  | 会议室/用户姓名/终端登记名称                                 |          |
| allowGuest      | Varchar  | 是否允许访客,允许(yes),不允许(no),默认为yes                  |          |

正确响应数据报格式：
```json
{
    "code": "200",
    "timeStamp": "2017-05-24 15:41:30",
    "results": {
        "isDot": xxxx,
        "sipkey": "xxxx",
        "alias": "xxx@xxx.com",
        "password": "xxxx",
        "participantName": "xxxx",
        "roleType": "xxxx",
        "mcuHost": "xxx.xxx.cn",
        "companyId": xxx,
        "isRecord": xxxx,
        "isLive": xxxx
    }
}
```
# REST API接口地址

## API命令调用的前缀规则：
https://mcuHost/api/services/<会议室>/
其中会议室是召开视频会议所在会议室的地址或id。云平台为每个会议室分配一个email格式全局唯一的地址，便于记忆；同时为每个会议室分配一个全局唯一的全数字的会议号id便于终端或手机通过遥控器/键盘输入
>例如：https://mcuHost/api/services/1061/new_session 或 https://mcuHost/api/services/zjvmr@myvmr.cn/new_session

## REST API 的认证
除了最初用于申请令牌(token)的new_session命令，客户端所发起的所有其他请求都需要将申请到的token作为认证凭据，以获得调用该请求的权限。令牌通过HTTP Header中的关键字token提交，如：
>token : xxxxxxxxxxxxxxxxxxxxxxxxxx
token有效期为两分钟。在失效之前，需要调用刷新命令refresh_session获取新的token进行后续通讯。
## REST API 的数据格式
除非另有规定，所有REST请求和应答的数据格式都是类型为application/json 的JSON对象。应答由“status”和”result”两个字段组成：

>status：接口调用状态，成功或失败。<br>
result ：返回的结果

## REST API详述 
会中管理API按功能大致分为：访问控制、会议控制、参会者控制以及云平台发送给控制端的各类事件。
### 访问控制API
请求的REST URL格式:
https://mcuHost/api/services/<会议室地址或id>/<请求>

| ***请求命令***    | **GET/POST** |           **注释**                        |
| --------------- | -------- | ----------------------------------  |
| new_session     | POST     | 从云平台获取通讯用的令牌（token）        |
| refresh_session | POST     | 刷新并获取新的通讯令牌（token）          |
| end_session     | POST     | 释放通讯令牌，有效断开与会议室的连接       |

#### new_session命令
本命令用于从云平台获取通讯用的令牌。

#### 请求头部

new_session除了传递的jason格式的消息体以外，还需在请求头部包含以下几个信息：

| 参数 | **Value示例** | **说明**                                 |
| ---- | ------------- | ---------------------------------------- |
| pin  | 123456        | 如果设置了入会密码，这是主持人或访客密码 |

##### 请求消息体参数
| **参数**     | **Value示例** | **说明**   |
| ------------ | ------------- | ---------- |
| display_name | Jiang         | 参会者名字 |
|              |               |            |
##### 请求消息体实例
```json
{“display_name”:”jiang”, “hideme”: “no”}
```



