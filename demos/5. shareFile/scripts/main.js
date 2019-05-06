'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('MainCtrl', ['Meet', '$timeout', '$q', '$log', '$rootScope', '$sce', '$scope', '$interval', function(Meet, $timeout, $q, $log, $rootScope, $sce, $scope, $interval) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var _this = this;
    var rtc = new ZjRTC(); // 
//  rtc.pipEnable = true; // 仅在需要共享文件时设置此项，打开此功能需要额外消耗CPU。

    rtc.onSetup = function(stream, pinStatus, conferenceExtension) {
      $timeout(function() {
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

    this.connect = function(pin, extension) {
      rtc.connect(pin, extension);
    };

    rtc.onConnect = function(stream) {
      if (rtc.call_type === 'video' || rtc.call_type == 'recvonly') {
        $('#rvideo')[0].srcObject = stream;
        $('#raudio')[0].srcObject = stream;
      }
    };



    var apiServer = 'cs.zijingcloud.com',
      mcuHost = '',
      alias = '1061',
      password = '',
      displayName = 'demo';
    // rtc.pin = password; // conference password, if it has.

    var data = {
        joinAccount: alias,
        joinPwd:password,
        participantName:displayName
    }

    // get conference information
    Meet.getAuth(apiServer, data).$promise.then(function(res){
      if(res.code === '200')
      {
        mcuHost = res.results.mcuHost; rtc.pin = password
      }
      else
        alert(res.results);
    })
    .catch(function(err){
      alert(`接口异常，请确认您有权访问该接口:${err.config.url}。`);
    })



    // click enter to conference
    $scope.enterConference = function(){
        rtc.makeCall(mcuHost, alias, displayName, null, 'video');
    }
    $scope.exitConference = function(){
      rtc.disconnect();
    }


    $scope.resetFileStream = function(){
      rtc.present(null);
//    rtc.pipLocalStreamWithStream();
    }
    $scope.selectFileStream = function(){
      var file = $('#videoFile')[0].captureStream();
      //替换主视频流
      rtc.present('screen_http');
      rtc.shareMp4Video(file);
      // 确保 rtc.pipEnable 设置为true；
//    rtc.pipLocalStreamWithStream(file);
    }




    rtc.onError = function(msg){
      console.log('onError: ', msg);
    }
    window.onbeforeunload = function(){
      rtc.disconnect();
    }
  }]);