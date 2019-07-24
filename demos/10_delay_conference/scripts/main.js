'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
    .controller('MainCtrl', ['Meet', '$timeout', '$q', '$log', '$rootScope', '$sce', '$scope', '$interval', function (Meet, $timeout, $q, $log, $rootScope, $sce, $scope, $interval) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var _this = this;
        var rtc = new ZjRTC(); //
        var zjReg = new ZjRegister(); // register for receiving incoming call;
        rtc.clayout = "4:4";
        rtc.simulcast = false;//开启多流模式
        rtc.isShiTong = false;//是否开启专属云引擎 如果为true simulcast 必须为true；
        $scope.uuid2Streams = {}; // {uuid: stream};
        $scope.participants = {}; // {uuid: stream};
        $scope.simulcast = rtc.simulcast;
        $scope.selfUUid = "";
        $scope.termail01={
            alias:"hjjs001@ddguokehuijian.com",//端呼叫地址
            alias_name:"家属",//端呼叫名称
            sipkey:"7971"//端的短号地址
        };
        $scope.termail02={
            alias:"hjsf001@ddguokehuijian.com",
            alias_name:"司法",
            sipkey:"7970"
        };
        var apiServer = 'bss.lalonline.cn', //api地址
            mcuHost = '',
            alias = '1867',//会议室号
            password = '123456',//主持人入会密码
            displayName = 'mork';
            // displayName = 'anonymous_bot'; //入会别名
        var data = {
            joinAccount: alias,
            joinPwd: password,
            participantName: displayName
        }

        // get conference information
        Meet.getAuth(apiServer, data).$promise.then(function (res) {
            if (res.code === '200') {
                mcuHost = res.results.mcuHost;
                rtc.pin = password
            }
            else
                alert(res.results);
        })
            .catch(function (err) {
                alert(`接口异常，请确认您有权访问该接口:${err.config.url}。`);
            })


        // 被动入会
        zjReg.onIncoming = function (msg) {
            setTimeout(function () {
                rtc.oneTimeToken = msg.token; // used to pass call token
                rtc.makeCall(mcuHost, msg.remote_alias + "@" + msg.owner, displayName, null, 'video');
            },);
        }
        $scope.selectChange = function(){
            console.log("#################");
        }
        // click enter to conference
        $scope.enterConference = function () {
            //开启会见
            rtc.makeCall(mcuHost, alias, displayName, null, 'video');
        }
        $scope.exitConference = function () {
            rtc.disconnectAll();
            $scope.participants = {};
        }
        $scope.exchange = function (falg) {
            rtc.simulcast = falg;
            $scope.simulcast = rtc.simulcast;
        }

        rtc.onSetup = function (stream, pinStatus, conferenceExtension) {

            $timeout(function () {
                $log.debug('ZjRTC.onSetup', stream, pinStatus, conferenceExtension);

                if (stream) {
                    $('#lvideo')[0].srcObject = stream;
                }

                if (!stream && conferenceExtension) {
                    $rootScope.$broadcast('call::extensionRequested', conferenceExtension);
                } else if (pinStatus !== 'none') {
                    $rootScope.$broadcast('call::pinRequested', pinStatus === 'required');
                } else {
                    _this.connect();
                }
            });
        };

        this.connect = function (pin, extension) {
            //禁用本地麦克风
            $scope.microphoneMuted = rtc.muteAudio(true);
            rtc.connect(pin, extension);
        };

        rtc.onConnect = function (stream, uuid) {
            //监控人入会以后，即可发送自己静音，并且邀请两端入会
            $scope.selfUUid = rtc.uuid;
            //1、监控人员静音入会，并邀请两端入会
            // rtc.dialOut($scope.termail01.sipkey,"auto",'guest',"",$scope.termail01.alias_name);
            // rtc.dialOut($scope.termail02.sipkey,"auto",'guest',"",$scope.termail02.alias_name);
            //2、监控进会以后 给自己静画取消延时
            rtc.setParticipantVideoMute(rtc.uuid,"hard_vmute");
            rtc.setParticipantDelayPlay(rtc.uuid,"cancel_delay");
            if (rtc.call_type === 'video' || rtc.call_type == 'recvonly') {
                if (rtc.simulcast) {
                    // 多流模式，第一个流为音频流，其没有uuid。 后续流为视频流，uuid为视频流的所有者
                    if (!uuid) { //
                        $('#raudio')[0].srcObject = stream;
                    } else {
                        $scope.uuid2Streams[uuid] = stream;
                        console.log('uuid: ', uuid, 'stream: ', stream, ' added');
                        let newVideo = $('<video id="' + uuid + '" muted autoplay playsinline></video>')[0];
                        newVideo.srcObject = stream;
                        $("#" + uuid)[0].append(newVideo);
                    }
                } else {
                    $('#rvideo')[0].srcObject = stream;
                    $('#raudio')[0].srcObject = stream;
                }
            }
        };

        //多流模式下视频流更新
        rtc.onRemoveStream = function (uuid) {
            let uuidSelector = '#' + uuid;
            $(uuidSelector)[0].remove();
            console.log('uuid: ', uuid, ' removed.');
        }

        rtc.onUpdateStream = function (stream, uuid) {
            delete $scope.uuid2Streams[uuid];
            let uuidSelector = '#' + uuid;
            $(uuidSelector)[0].srcObject = stream;
            console.log('uuid: ', uuid, 'stream: ', stream, ' updated');
        }
        //获取与会人列表
        rtc.onParticipantCreate = function (data) {
            console.log('call::onParticipantCreate');
            let newPartcipant = _this.parseParticipant(data);
            $timeout(_this.updatepartcipant(newPartcipant), 100, false);
        };
        rtc.onParticipantUpdate = function (data) {
            console.log('call::participantUpdate');
            let updatePartcipant = _this.parseParticipant(data);
            $timeout(_this.updatepartcipant(updatePartcipant), 100, false);
        };
        rtc.onParticipantDelete = function (data) {
            console.log('call::participantDeleted::'+ data.uuid);
            delete $scope.participants[data.uuid];
        };

        rtc.onError = function (msg) {
            console.log('onError: ', msg);
        }
        window.onbeforeunload = function () {
            rtc.disconnect();
        }
        this.parseParticipant = function (data) {

            function yesToBoolean(yes) {
                return yes === 'YES' ? true : false;
            }

            function allowToBoolean(allow) {
                return allow === 'ALLOW' ? true : false;
            }

            let participant = {
                apiUrl: data.api_url,
                displayName: data.display_name || data.uri.replace('sip:', ''),
                hasMedia: data.has_media,
                overlayText: data.overlay_text,
                role: data.is_external ? 'external' : data.role,
                serviceType: data.service_type,
                spotlight: data.spotlight,
                startTime: data.start_time * 1000 || Date.now(),
                protocol: data.protocol,
                vendor: data.vendor,
                uri: data.uri,
                uuid: data.uuid,
                isVideo: yesToBoolean(data.is_video_call),
                isChair: data.role === 'chair',
                isWaiting: data.service_type === 'waiting_room',
                isConnected: data.service_type === 'conference' || data.service_type === 'lecture',
                isConnecting: data.service_type === 'connecting',
                isStreaming: data.is_streaming_conference,
                isMuted: yesToBoolean(data.is_muted),
                isPresenting: yesToBoolean(data.is_presenting),
                isPresentationSupported: yesToBoolean(data.presentation_supported),
                isFeccSupported: yesToBoolean(data.fecc_supported),
                isRxPresentation: allowToBoolean(data.rx_presentation_policy),
                isExternal: data.is_external,
                delay_time: data.delay_time,
                isEarMuted:yesToBoolean(data.ear_muted)
            };
            if (data.is_speaking !== undefined) {
                participant['vad'] = data.is_speaking === "YES" ? 100 : 0;
            }
            if ($scope.selfUUid == participant.uuid) {
                participant.isSelf = true;
            }
            return participant;
        };
        this.updatepartcipant = function (partcipant) {
            if (partcipant.uuid in $scope.participants) {
                angular.copy(partcipant, $scope.participants[partcipant.uuid]);
            } else { // create pariticipant
                if (partcipant.displayName.indexOf('anonymous') === -1) {
                    $scope.participants[partcipant.uuid] = partcipant;
                }

            }
        }
        //关闭自己麦克风
        this.toggleMicrophone = function (flag) {
            $scope.microphoneMuted = rtc.muteAudio(flag);
        };
        //会见demo --ldy
        //
        $scope.setParticipantDelay = function (participant,flag) {
            //默认都是开启 isDelay
            if(flag==1){
                //取消延时观看
                // participant.unDelay = true;

                rtc.setParticipantDelayPlay(participant.uuid,"cancel_delay");
            }else{
                rtc.setParticipantDelayPlay(participant.uuid);
                // participant.unDelay = false;
            }
        };
        //插话和取消插话
        $scope.switchChimedMio = function () {
            let participants = $scope.participants;
            console.log(participants);
            if(!$scope.microphoneChimed){
                //插话
                //取消自己麦克风静音
                _this.toggleMicrophone();
                for(let uuid in participants){
                    if(participants[uuid].isSelf){
                        continue;
                    }
                    //插话
                    rtc.setParticipantDelayPlay(uuid,"cancel_delay");
                    ////静音
                    rtc.setParticipantMute(uuid,"mute");
                }
            }else{
                //自己麦克风静音
                _this.toggleMicrophone(true);
                for(let uuid in participants){
                    if(participants[uuid].isSelf){
                        continue;
                    }
                    //取消插话
                    rtc.setParticipantDelayPlay(uuid);
                    //取消静音
                    rtc.setParticipantMute(uuid);
                }
            }
            $scope.microphoneChimed = ! $scope.microphoneChimed;
        };
        //暂停和恢复
        $scope.switchMuteOther = function () {
            let participants = $scope.participants;
            console.log(participants);
            if(!$scope.isMuteOther){
                //暂停
                for(let uuid in participants){
                    if(participants[uuid].isSelf){
                        continue;
                    }
                    //静音
                    rtc.setParticipantMute(uuid,"mute");
                    //禁画
                    rtc.setParticipantVideoMute(uuid,"hard_vmute");
                }
            }else{
                //取消插话
                for(let uuid in participants){
                    if(participants[uuid].isSelf){
                        continue;
                    }
                    rtc.setParticipantMute(uuid);
                    //禁画
                    rtc.setParticipantVideoMute(uuid);
                }
            }
            $scope.isMuteOther = ! $scope.isMuteOther;
        };
        //静音
        $scope.switchMute = function (participant,flag) {
            //静音
            if(flag==1){
                rtc.setParticipantMute(participant.uuid,"mute");
            }else{
                rtc.setParticipantMute(participant.uuid);
            }

        }
        //插话某人闭耳
        //单独插话
        $scope.switchMuTear = function(flag){
            let participant= $('#selectMutear').val();
            participant = JSON.parse(participant);
            let participants = $scope.participants;
            if(flag==1){
                //取消自己麦克风静音
                _this.toggleMicrophone();
                //插话某一个人
                //取消被插话的延时
                rtc.setParticipantDelayPlay(participant["uuid"],"cancel_delay");
                //1、双方静音 和禁止话
                for(let puuid in participants){
                    if(participants[puuid].isSelf){
                        //过滤掉监控人员
                        continue;
                    }
                    //静音
                    rtc.setParticipantMute(puuid,"mute");
                    //禁画
                    rtc.setParticipantVideoMute(puuid,"hard_vmute");
                    //让另外一个人闭音
                    if(participant["uuid"]!=puuid){
                        rtc.setParticipantMutear(puuid,"mutear");
                    }else{
                        rtc.setParticipantMutear(puuid);
                    }
                }
            }else{
                //取消插话某人
                //自己麦克风静音
                _this.toggleMicrophone(true);
                //取消被插话的延时
                rtc.setParticipantDelayPlay(participant["uuid"]);
                for(let uuid in participants){
                    if(participants[uuid].isSelf){
                        //过滤掉监控人员
                        continue;
                    }
                    //取消静音
                    rtc.setParticipantMute(uuid);
                    //取消禁画
                    rtc.setParticipantVideoMute(uuid);
                    //让另外一个人取消闭音
                    if(participant["uuid"]!=uuid){
                        rtc.setParticipantMutear(uuid);
                    }
                }
                rtc.setParticipantMutear(participant.uuid);
            }
        }
        //过滤和关闭过滤
        $scope.switchMuTearOne = function(participant,flag){
            if(flag==1){
                //闭音
                rtc.setParticipantMutear(participant.uuid,"mutear");
                //取消延时
                rtc.setParticipantDelayPlay(participant.uuid,"cancel_delay");
            }else{
                rtc.setParticipantMutear(participant.uuid);
                rtc.setParticipantDelayPlay(participant.uuid);
            }
        }
    }]);