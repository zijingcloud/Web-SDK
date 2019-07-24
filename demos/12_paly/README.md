操作流程
1、var vcrtc = new VCrtcSerive();
VCrtcSerive 对象属性：
participants = {};//参会者集合
videoStream;//远端视频流
audioStream;//远端音频流
localStream;//本地视频流
mcuHost; //会中mcu host
alias; //会议号码
pwd; //会议室密码
conferenceId; //会见ID
selfUUid; //监控者自己的ID
displayName = "anonymous_mork"; //监控会议别名

方法：
//监控加入会议
@mcuHost 会中mcu host
@alias 会议室号
@pwd 密码
enterConference(mcuHost, alias, pwd)
//监控退会
exitConference()
//开始插话
@conferenceId 会见ID
@alais 插话对象 无就是全插话
startChimedMio(conferenceId, alais)
//结束插话
endChimedMio(conferenceId, alais)
//中断会议
stopConfrence()
//恢复会议
recorveConfrence()
//开启过滤
openFilterOne()
//关闭过滤
closeFilterOne