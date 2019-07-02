
# 会议室

## 创建会议室
    请求接口:https://domain/api/v3/mcu/vmr/create.shtml

    请求方式:POST

    请求参数: 

    {
	"cloudid":1,
	"hostPin":"123456",
	"guestPin":"234567",
	"alias":"123@zijingcloud.com",
	"allowGuests":"yes",
	"hostIds":"1",
	"departmentId":1,
	"uid":1,
	"maxClarity":"1080",
	"maxSquare":5,
	"pDesc":"测试",
	"hostView":"1:7"
    }

    参数说明

参数位置 | 参数名称 | 参数 | 类型 | 是否必须 | 备注
---------| ----- | -----|-----|---------|----
header | Authorization | xxxxx | String | 是 | 授权码
body   | cloudid | 1 |  Integer | 是 | mcuid
body   | hostPin | 234567 |  String | 是 | 主持人密码
body   | guestPin | 234567 |  Integer | 是 | 参会人密码
body   | alias | ds123@163.com |  String | 是 | 别名
body   | allowGuests | yes or no |  String | 是 | 允许访客
body   | hostIds | 1 |  String | 是 | 主持人id
body   | departmentId | 1 |  Integer | 是 | 会议室所属部门
body   | uid | 9923 |  Integer | 是 | 创建人id
body   | maxClarity | 1080 |  String | 是 | 最多分辨率
body   | maxSquare | 5 |  Integer | 是 | 最大方数(同时在线人数)
body   | pDesc | 测试会议 |  String | 是 | 会议室名称
body   | hostView | 1:7 |  String | 是 | 布局


## 修改会议室

    请求接口:https://domain/api/v3/mcu/vmr/update.shtml

    请求方式:PUT

    请求参数: 

    {
	"pid":1,
	"hostPin":"123456",
	"guestPin":"234567",
	"allowGuests":"yes",
	"hostIds":"1",
	"departmentId":1,
	"uid":1,
	"maxClarity":"1080",
	"maxSquare":5,
	"pDesc":"测试",
	"hostView":"1:7"
    }

    参数说明

参数位置 | 参数名称 | 参数 | 类型 | 是否必须 | 备注
---------| ----- | -----|-----|---------|----
header | Authorization | xxxxx | String | 是 | 授权码
body   | pid | 1 |  Integer | 是 | 会议室id
body   | hostPin | 234567 |  String | 是 | 主持人密码
body   | guestPin | 234567 |  Integer | 是 | 参会人密码
body   | alias | ds123@163.com |  String | 是 | 别名
body   | allowGuests | yes or no |  String | 是 | 允许访客
body   | hostIds | 1 |  String | 是 | 主持人id
body   | departmentId | 1 |  Integer | 是 | 会议室所属部门
body   | uid | 9923 |  Integer | 是 | 创建人id
body   | maxClarity | 1080 |  String | 是 | 最多分辨率
body   | maxSquare | 5 |  Integer | 是 | 最大方数(同时在线人数)
body   | pDesc | 测试会议 |  String | 是 | 会议室名称
body   | hostView | 1:7 |  String | 是 | 布局

## 删除会议室

    请求接口:https://domain/api/v3/mcu/vmr/destroy.shtml?pid=1

    请求方式:DELETE

    请求参数: 

    参数说明

参数位置 | 参数名称 | 参数 | 类型 | 是否必须 | 备注
---------| ----- | -----|-----|---------|----
header | Authorization | xxxxx | String | 是 | 授权码
param   | pid | 1 |  Integer | 是 | 会议室id

# 会议

## 预约会议
    请求接口:https://domain/api/v3/temp/sub_meet/create.shtml

    请求方式:POST

    请求参数: 

    {
	"account":"xxx@xxx.com",
	"bscId":1,
	"max_square":10,
	"theme":"测试",
	"introduction":"简介",
	"startTime":"2019-01-18 9:25",
	"endTime":"2019-01-18 9:45",
	"visitor_ids":"9865",
	"isAutoOpen":"yes",
	"alias":"xxx@xxx.com"
    }

    参数说明

参数位置 | 参数名称 | 参数 | 类型 | 是否必须 | 备注
---------| ----- | -----|-----|---------|----
header | Authorization | xxxxx | String | 是 | 授权码
body   | account | xxx@xxx.com |  String | 是 | 创建人账号
body   | bscId | 1 |  Integer | 是 | 会议室id
body   | max_square | 5 |  Integer | 是 | 最大参会人数
body   | theme | 测试 |  String | 是 | 主题
body   | introduction | 简介 |  String | 是 | 描述
body   | startTime | 2019-01-18 9:25 |  String | 是 | 开始时间
body   | endTime | 2019-01-18 9:55 |  String | 是 | 结束时间
body   | visitor_ids | 9923 |  String | 是 | 创建人id
body   | isAutoOpen | yes |  String | 是 | 是否自动拉起
body   | alias | xxx@xxx.com |  String | 是 | 别名


## 查看会议
   请求接口:https://domain/api/v3/subscribe/detail.shtml?sub_id=9865

    请求方式:GET

    请求参数: 

    参数说明

参数位置 | 参数名称 | 参数 | 类型 | 是否必须 | 备注
---------| ----- | -----|-----|---------|----
header | Authorization | xxxxx | String | 是 | 授权码
param   | sub_id | 9865 |  Integer | 是 | 会议id



## 取消会议

    请求接口:https://domain/api/v3/subscribe/destroy.shtml

    请求方式:DELETE

    请求参数: 
    {
	"sub_id":9865
    }
    参数说明

参数位置 | 参数名称 | 参数 | 类型 | 是否必须 | 备注
---------| ----- | -----|-----|---------|----
header | Authorization | xxxxx | String | 是 | 授权码
body   | sub_id | 9865 |  String | 是 | 会议id

# 用户

## 创建用户

    请求接口:https://domain/api/v3/company/user/create.shtml

    请求方式:POST

    请求参数: 
    {
    "account": "xx@xxxx.com",
    "password": "123456",
    "userRole": "user",
    "departmentId": "",
    "position": "开发",
    "trueName": "张三",
    "phone": "12222222222",
    "email": "xxxxxx@xx.com"
    }
    参数说明

参数位置 | 参数名称 | 参数 | 类型 | 是否必须 | 备注
---------| ----- | -----|-----|---------|----
header | Authorization | xxxxx | String | 是 | 授权码
body   | account | xx@xxxx.com |  String | 是 | 用户账号
body   | password | xxxx |  String | 是 | 用户密码
body   | userRole | user |  String | 是 | 用户角色
body   | departmentId | 9865 |  String | 否 | 部门id
body   | position | 开发 |  String | 否 | 岗位
body   | trueName | 张三 |  String | 是 | 名称
body   | phone | 12222222222 |  String | 是 | 电话
body   | email | xxxx@xx.com |  String | 否 | 邮箱

## 修改用户
    请求接口:https://domain/api/v3/company/user/update.shtml

    请求方式:PUT

    请求参数: 
    {
    "id": 9861,
    "trueName": "李四",
    "emailAddress": "xxxxxx@163.com",
    "type": "user",
    "phone": "12222222222",
    "position": "开发"
    }
    参数说明

参数位置 | 参数名称 | 参数 | 类型 | 是否必须 | 备注
---------| ----- | -----|-----|---------|----
header | Authorization | xxxxx | String | 是 | 授权码
body   | id | 11 |  String | 是 | 用户id
body   | type | user |  String | 是 | 用户角色
body   | position | 开发 |  String | 否 | 岗位
body   | trueName | 张三 |  String | 是 | 名称
body   | phone | 12222222222 |  String | 是 | 电话
body   | email | xxxx@xx.com |  String | 否 | 邮箱


## 删除用户
    请求接口:https://domain/api/v3/company/user/destroy.shtml?uid=9863

    请求方式:DELETE

    请求参数: 

    参数说明

参数位置 | 参数名称 | 参数 | 类型 | 是否必须 | 备注
---------| ----- | -----|-----|---------|----
header | Authorization | xxxxx | String | 是 | 授权码
param   | uid | 9865 |  Integer | 是 | 用户id

# 录制文件