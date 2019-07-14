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
        $scope.enterConference1 = function () {
            //开启会见
            vcrtc.enterConference("7d3105fb8c3c4e61a853903ec2a85005");
            $timeout(function () {
                $log.debug('ZjRTC.onSetup');
                $scope.localStream = vcrtc.localStream;
                $('#lvideo')[0].srcObject = vcrtc.localStream;
                $('#rvideo')[0].srcObject = vcrtc.videoStream;//远端视频流
                $('#raudio')[0].srcObject = vcrtc.audioStream;//远端音频流
            }, 5000);
        }
        $scope.exitConference = function () {
            vcrtc.exitConference();

        }
        //插话和取消插话
        $scope.switchChimedMio = function (flag, conferenceId, alias) {
            // conferenceId 会见id
            //alias 插话的对象短号
            alias = 7971;
            if (flag == 1) {
                //开启插话
                vcrtc.startChimedMio(conferenceId, alias);
            } else {
                //关闭插话
                vcrtc.endChimedMio(conferenceId, alias);
            }

            $scope.microphoneChimed = !$scope.microphoneChimed;
        };
        //暂停和恢复
        $scope.switchMuteOther = function (flag) {
            if (flag == 1) {
                //暂停
                vcrtc.stopConfrence();
            } else {
                //恢复
                vcrtc.recorveConfrence();
            }
            $scope.isMuteOther = !$scope.isMuteOther;
        };
        //过滤和关闭过滤
        $scope.switchMuTearOne = function (flag) {
            if (flag == 1) {
                //开启过滤
                vcrtc.openFilterOne();
            } else {
                //关闭过滤
                vcrtc.closeFilterOne();
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
            }

        });
    }]);