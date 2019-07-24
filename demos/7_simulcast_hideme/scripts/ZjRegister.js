'use strict';

var requestTimeout = 5 * 1000;

function encodeUtf8(str) {
    return window.unescape(encodeURIComponent(str));
}

function prepareRequest(method, url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = requestTimeout;

    if (callback) {
        xhr.onload = function(e) {
            if (e.target.status === 200) {
                try {
                    callback(null, JSON.parse(e.target.responseText));
                } catch (err) {
                    callback(err);
                }
            } else {
                callback(e);
            }
        };

        xhr.onerror = function(event) {
            callback(event);
        };
        xhr.ontimeout = function(event) {
            callback(url + ' timed out');
        };
    }

    xhr.open(method, url);
    return xhr;
}

function ZjRegister(){
  var self = this;
  self.host = null;
  self.alias = null;
  self.token = null;
  self.event_source = null;
  self.onLog = function() { console.info.apply(console, arguments); };

  self.onIncomingCanceled = null;
  self.onIncoming = null;
  self.onRegistered = null;
  self.onUnregistered = null;
  self.onError = null;
};

ZjRegister.prototype.register = function(host, account, password){
  var self = this;
  self.alias = account;
  self.host = host;
  var array = account.split('@');
  var username = array[0];
  self.requestToken(
    self.host,
    self.alias,
    username,
    password,
    function(err, response){
      if(err)
      {
        self.onLog('requestToken failed', response);
        if(self.onError)
          self.onError(err);
      } else{
        self.token = response.result.token;
        self.event_source = new EventSource('https://' + self.host + '/api/registrations/' + encodeURIComponent(self.alias) + '/events?token=' + self.token)
        self.event_source.addEventListener('incoming_cancelled', function(e){
          var msg = JSON.parse(e.data);
          self.onLog('registrationEventSource incoming_cancelled', msg);
          if(self.onIncomingCanceled){
            self.onIncomingCanceled(msg);
          }
        });

        self.event_source.addEventListener('incoming', function(e){
          var msg = JSON.parse(e.data);
          self.onLog('registrationEventSource incoming', msg);
          if(self.onIncoming){
            self.onIncoming(msg);
          }
        });

        var eventSourceTimeout = setTimeout(function(){
          self.event_source.onerror('EventSource.open timeout');
        }, requestTimeout);

        self.event_source.onopen = function(e){
          self.onLog('registrationEventSource.onopen', e);
          self.event_source.onopen = undefined;
          clearTimeout(eventSourceTimeout);
          self.tokenRefreshInterval = setInterval(function(){
            self.refreshToken(function(err, response){
              if(err){
                self.onLog('refreshToken failed', err)
                if(self.onError)
                  self.onError(err);
              } else {
                self.token = response.result.token;
              }
            });

          }, (response.result.expires || 120) * 1000 / 3);
          if(self.onRegistered)
            self.onRegistered();
        };
        
        self.event_source.onerror = function(event){
          clearTimeout(eventSourceTimeout);
          if(self.onError)
            self.onError(event);
        }
      }
    });
};


ZjRegister.prototype.unregister = function(callback){
  var self = this;
  if(self.event_source)
  {
    self.event_source.close();
    self.event_source = null;
  }
  if(self.tokenRefreshInterval)
  {
    clearInterval(self.tokenRefreshInterval);
    self.tokenRefreshInterval = null;
  }
  self.releaseToken(function(err, result){
    if(self.onUnregistered)
      self.onUnregistered();
    if(err)
      self.onLog('unregister failed', err);
    if(callback)
      setTimeout(callback);
  })

}

ZjRegister.prototype.requestToken = function(host, alias, username, password, callback){
  var xhr = prepareRequest(
      'post', [
          'https:/', host, 'api/registrations', encodeURIComponent(alias),
          'new_session'
      ].join('/'),
      callback);
  xhr.setRequestHeader('Authorization',
      'x-cloud-basic ' + window.btoa(encodeUtf8(username + ':' + password)));
  xhr.setRequestHeader('X-Cloud-Authorization',
      'x-cloud-basic ' + window.btoa(encodeUtf8(username + ':' + password)));
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify({}));
};

ZjRegister.prototype.refreshToken = function(callback){
  var self = this;
  var xhr = prepareRequest(
      'post', [
          'https:/', self.host, 'api/registrations', encodeURIComponent(self.alias),
          'refresh_session'
      ].join('/'),
      callback);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify({
      'token': self.token
  })); 
};

ZjRegister.prototype.releaseToken = function(callback){
  var self = this;
  if(self.token)
  {
    var xhr = prepareRequest(
        'post',
        'https://' + self.host + '/api/registrations/' + encodeURIComponent(self.alias) + '/end_session?token=' + self.token,
        callback);
    xhr.send();
  } else{
    callback();
  }
};

ZjRegister.prototype.reject = function(alias, token){
  var self = this;
  self.onLog('registrationService.on callReject', alias, token);
  var xhr = prepareRequest(
      'post',
      'https://' + self.host + '/api/services/' + encodeURIComponent(alias) + '/end_session?token=' + token);
  xhr.send();
};