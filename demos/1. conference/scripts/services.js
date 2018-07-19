angular.module('angularApp')
.service('Meet', function($resource){
    /*
        joinAccount:"",
        joinPwd:"",
        participantName:""
    */
    this.getAuth = function(apiServer, data){
        return $resource(`https://${apiServer}/api/v3/meet/checkJoin.shtml`).save(data);
    }

})
