'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
    .controller('MainCtrl', ['$timeout', '$q', '$log', '$rootScope', '$sce', '$scope', '$interval', function ($timeout, $q, $log, $rootScope, $sce, $scope, $interval) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var _this = this;
        var vcrtc = new VCrtcSerive(); // new 一个VCrtcSerive
        vcrtc.mcuHost = "test1.34s.cn"; //mcuhost
        vcrtc.pwd = "123456";
        vcrtc.alias = "1865";
        // click enter to conference
        $scope.localStream;
        $scope.simulcast = vcrtc.vcrtc.simulcast;//是否开启多流模式
        $scope.enterConference1 = function () {
            //开启会见
            vcrtc.enterConference("123456789987654321");

                $timeout(function () {
                    $log.debug('ZjRTC.onSetup');
                    $scope.localStream = vcrtc.localStream;
                    if(!$scope.simulcast) {
                        $('#rvideo')[0].srcObject = vcrtc.videoStream;//远端视频流
                    }
                    $('#raudio')[0].srcObject = vcrtc.audioStream;//远端音频流
                }, 5000);
            }
        $scope.exitConference = function () {
            vcrtc.exitConference();

        }
        //插话和取消插话
        $scope.switchChimedMio = function (flag, conferenceId) {
            // conferenceId 会见id
            //alias 插话的对象短号
            let alias = "";
            alias = $("#chaId").val();
            if (flag == 1) {
                //开启插话
                let msg = vcrtc.startChimedMio(conferenceId, alias);
                if (msg.code == 200) {
                    // alert("插话成功");
                } else {
                    // alert("插话失败");
                }
            } else {
                //关闭插话
                let msg = vcrtc.endChimedMio(conferenceId, alias);
                if (msg.code == 200) {
                    // alert("关闭插话成功");
                } else {
                    // alert("关闭插话失败");
                }
            }

            $scope.microphoneChimed = !$scope.microphoneChimed;
        };
        //暂停和恢复
        $scope.switchMuteOther = function (flag) {
            if (flag == 1) {
                //暂停
                let msg = vcrtc.stopConfrence();
                if (msg.code == 200) {
                    alert("暂停成功");
                } else {
                    alert("暂停失败");
                }
            } else {
                //恢复
                let msg = vcrtc.recorveConfrence();
                if (msg.code == 200) {
                    alert("恢复成功");
                } else {
                    alert("恢复失败");
                }
            }
            $scope.isMuteOther = !$scope.isMuteOther;
        };
        //过滤和关闭过滤
        $scope.switchMuTearOne = function (flag) {
            if (flag == 1) {
                //开启过滤
                let msg = vcrtc.openFilterOne();
                if (msg.code == 200) {
                    alert("过滤成功");
                } else {
                    alert("过滤失败");
                }
            } else {
                //关闭过滤
                let msg =  vcrtc.closeFilterOne();
                if (msg.code == 200) {
                    alert("关闭过滤成功");
                } else {
                    alert("关闭过滤失败");
                }
            }
            $scope.switchMuTearOneFlag = !$scope.switchMuTearOneFlag;
        }
        window.addEventListener('message', function (event) {
            console.log(event);
            if (event.origin != window.location.origin) {
                return;
            }
            if (event.data.type == 'diconnect') {
                alert("会议被挂断");
            } else if (event.data.type == 'Exception') {
                console.log(event.data.code);
                console.log(event.data);
                alert("EXception");
            }else if (event.data.type == 'Stream'){
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                console.log(vcrtc.participants);
                console.log(vcrtc.uuid2Streams);
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                let uidId1 = "";
                let uidId2 = "";
                for(let k in vcrtc.uuid2Streams ){
                    uidId1 = k;
                    if(uidId1!="" && uidId2==""){
                        uidId2 = k;
                    }
                }
                $('#rvideo1')[0].srcObject = vcrtc.uuid2Streams[uidId1];//远端视频流
                $('#rvideo2')[0].srcObject = vcrtc.uuid2Streams[uidId2];;//远端视频流
            }

        });
    }]);