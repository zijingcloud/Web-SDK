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
        rtc.simulcast = true;//开启多流模式
        rtc.isShiTong = true;//是否开启专属云引擎 如果为true simulcast 必须为true；
        rtc.smallMaxFrameRate = 20;
        rtc.smallMaxWidth = 680;
        rtc.smallMaxHeigh = 520;
        rtc.audio_source=false;
        rtc.ext_layout=true;
        rtc.checkdup="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        //
        $scope.uuid2Streams = {}; // {uuid: stream};
        $scope.participants = {}; // {uuid: stream};
        $scope.simulcast = rtc.simulcast;

        var apiServer = "api.51vmr.cn",
            mcuHost = '',
            alias = '5000010',
            password = '1234',
            displayName = 'demo9';
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

        // click enter to conference
        $scope.enterConference = function () {
            rtc.makeCall(mcuHost, alias, displayName, null, 'video');
        }
        $scope.exitConference = function () {
            rtc.disconnect();
            $scope.participants={};
        }
        $scope.exchange = function(falg){
            rtc.simulcast = falg;
            $scope.simulcast = rtc.simulcast;
        }

        rtc.onSetup = function (stream, pinStatus, conferenceExtension) {
            //
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
            rtc.connect(pin, extension);
        };

        rtc.onConnect = function (stream, uuid) {
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
                        $("#"+uuid)[0].append(newVideo);
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
            $timeout(function () {
                $rootScope.$broadcast('call::participantDeleted', data.uuid);
            });
        };
        //获取与会人列表 end
        //多流模式下视频流更新 end
        //屏幕共享
        // rtc.onScreenshareStopped = function (msg) {
        //     console.log('onScreenshareStopped: ', msg);
        // }
        // rtc.onScreenshareMissing = function (msg) {
        //     var message = '使用屏幕共享网站需要支持 "https".\n 未检查到屏幕分享插件，请安装:\n https://cs.zijingcloud.com/static/extension/browser.html';
        //     alert(message);
        //     console.log(message);
        // }
        // $scope.screenShare = function () {
        //     rtc.present('screen');
        // }
        // $scope.exitScreenShare = function () {
        //     rtc.present(null);
        // }
        //屏幕共享 end

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
                delay_time: data.delay_time
            };
            if (data.is_speaking !== undefined) {
                participant['vad'] = data.is_speaking === "YES" ? 100 : 0;
            }
            return participant;
        };
        this.updatepartcipant = function (partcipant) {
            if (partcipant.uuid in $scope.participants) {
                $scope.participants[partcipant.uuid] = partcipant;
            } else { // create pariticipant
                if (partcipant.displayName.indexOf('anonymous') === -1) {
                    $scope.participants[partcipant.uuid] = partcipant;
                }

            }
        }
        $scope.setTxet = function (uuid,text) {
            rtc.setParticipantText(uuid.uuid,text);

        };
        $scope.setclayout = function(){
            rtc.setClayout("2:0");
        };
        $scope.camer = function(uuid,flag){
            rtc.setParticipantVideoMute(uuid.uuid,flag);
            $scope.isVideoMute = !$scope.isVideoMute;
        };
    }]);