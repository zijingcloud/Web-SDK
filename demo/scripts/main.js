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
    var zjReg = new ZjRegister(); // register for receiving incoming call;

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
      if (rtc.call_type === 'video') {
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
        zjReg.register(mcuHost, 'feng.wang@zijingcloud.com', 'wang@2015');
      }
      else
        alert(res.results);
    })
    .catch(function(err){
      alert(`接口异常，请确认您有权访问该接口:${err.config.url}。`);
    })


    // 被动入会
    zjReg.onIncoming = function(msg){
        setTimeout(function(){
          rtc.oneTimeToken = msg.token; // used to pass call token 
          rtc.makeCall(mcuHost, msg.conference_alias, displayName, null, 'video');
        },);
    }

    // click enter to conference
    $scope.enterConference = function(){
        rtc.makeCall(mcuHost, alias, displayName, null, 'video');
    }



  }]);