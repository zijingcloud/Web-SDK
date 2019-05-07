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
    rtc.simulcast = true;
    rtc.clayout = "4:4";
    rtc.isShiTong=true;
    $scope.uuid2Streams = {} // {uuid: stream};

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

    rtc.onConnect = function(stream, uuid) {
      if (rtc.call_type === 'video' || rtc.call_type == 'recvonly') {
        // $('#rvideo')[0].srcObject = stream; // first stream has no video stream
        // 多流模式，第一个流为音频流，其没有uuid。 后续流为视频流，uuid为视频流的所有者
        if(!uuid){ // 
          $('#raudio')[0].srcObject = stream;
        }
        else {
          $scope.uuid2Streams[uuid] = stream;
          console.log('uuid: ',uuid, 'stream: ', stream, ' added');
          let newVideo = $('<video id="'+uuid+'" muted autoplay playsinline></video>')[0];
          newVideo.srcObject = stream;
          $("#video-container")[0].append(newVideo);
        }
      }
    };

    rtc.onRemoveStream = function ( uuid) {
      let uuidSelector = '#'+uuid;
      $(uuidSelector)[0].remove();
      console.log('uuid: ',uuid, ' removed.');
    }

    rtc.onUpdateStream = function (stream, uuid) {
      delete $scope.uuid2Streams[uuid];
      let uuidSelector = '#'+uuid;
      $(uuidSelector)[0].srcObject = stream;
      console.log('uuid: ',uuid, 'stream: ', stream, ' updated');
    }

      var apiServer = '192.168.0.10',
          mcuHost = '',
          alias = '8006733',
          password = '4321',
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

    //屏幕共享
    $scope.screenShare = function(){
      rtc.present('screen');
    }
    $scope.exitScreenShare = function(){
      rtc.present(null);
    }
    rtc.onScreenshareStopped = function(msg){
      console.log('onScreenshareStopped: ', msg);
    }
    rtc.onScreenshareMissing = function(msg){
      var message = '使用屏幕共享网站需要支持 "https".\n 未检查到屏幕分享插件，请安装:\n https://cs.zijingcloud.com/static/extension/browser.html';
      alert(message);
      console.log(message);
    }

    rtc.onError = function(msg){
      console.log('onError: ', msg);
    }
    window.onbeforeunload = function(){
      rtc.disconnect();
    }
  }]);