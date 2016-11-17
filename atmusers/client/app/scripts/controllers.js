'use strict';

angular.module('clientApp')

  .controller('NavbarController', ['$http', 'ATMCtx', function ($http, ATMCtx) {
    var vm = this;
    vm.atmuser = ATMCtx;
  }])

  .controller('LoginCardStateController',
      ['$log', '$q', '$http', '$state', 'ATMCtx', 'CARD_NUMBER_LEN', 'Auth', 'ERRORS',
      function ($log, $q, $http, $state, ATMCtx, CARD_NUMBER_LEN, Auth, ERRORS) {

    $log.debug('LoginCardStateController');

    var vm = this;
    vm.CARD_NUMBER_LEN = CARD_NUMBER_LEN;

    vm.login = function() {
      var promise = Auth.checkATMUser(vm.atmuser.card)
        .then(function() {
          return 'loginpin';
        }, function(reason) {
          if (reason.status === 401) {
            return {nextState: 'error', params: {error: ERRORS.NOCARD}};
          } else if (reason.status === 403) {
            return {nextState: 'error', params: {error: ERRORS.CARD_BLOCKED}};
          } else {
            $q.reject(reason);
          }
        });

      $state.go('waiting', {promise: promise});
    };

    vm.atmuser = ATMCtx;
    vm.atmuser.card = '';
    vm.atmuser.errorPinCount = 0;

    if (ATMCtx.atmuser) {
      $state.go('logout');
    }
  }])

  .controller('LoginPinStateController', [
      '$log', '$q', '$http', '$state', 'ATMCtx',
      'PIN_CODE_LEN', 'Auth', 'ERRORS', 'MAX_ERROR_PIN_TRIES',
      function ($log, $q, $http, $state, ATMCtx,
        PIN_CODE_LEN, Auth, ERRORS, MAX_ERROR_PIN_TRIES) {
    $log.debug('LoginPinStateController');
    var vm = this;
    vm.pin = '';
    vm.PIN_CODE_LEN = PIN_CODE_LEN;

    vm.login = function() {

      var promise = Auth.login(ATMCtx.card, vm.pin)
        .then(function() {
          return Auth.setATMUser().then(function() {
            return 'main';
          });
        }, function(reason) {
          if (reason.status === 401) {
            ATMCtx.errorPinCount += 1;
            if (ATMCtx.errorPinCount === MAX_ERROR_PIN_TRIES) {
              return Auth.blockATMUser(ATMCtx.card).then(function() {
                return {nextState: 'error', params: {error: ERRORS.CARD_HAS_BEEN_BLOCKED}};
              }, function() {
                return {nextState: 'error', params: {error: ERRORS.UNKNOWN}};
              });
            } else {
              return {nextState: 'error', params: {error: ERRORS.PIN}};
            }
          } else {
            $q.reject(reason);
          }
        });

      $state.go('waiting', {promise: promise});
    };

    vm.exit = function() {
      $state.go('logincard');
    };

  }])

  .controller('LogoutStateController', ['$log', '$state', 'Auth', 'ATMCtx',
      function ($log, $state, Auth, ATMCtx) {
    $log.debug('LogoutStateController');

    //var vm = this;

    var promise = Auth.logout().then(function() {
      ATMCtx.atmuser = null;
      return 'logincard';
    }, function() {
      ATMCtx.atmuser = null;
      return 'logincard';
    });

    $state.go('waiting', {promise: promise});
  }])

  .controller('BalanceStateController', ['$log', 'ATMCtx',
      function ($log, ATMCtx) {
    $log.debug('BalanceStateController');
    var vm = this;
    vm.atmuser = ATMCtx.atmuser;
    vm.date = new Date();
  }])

  .controller('WithdrawalStateController', ['$log', '$q', '$state', 'ATMCtx', 'ERRORS',
      function ($log, $q, $state, ATMCtx, ERRORS) {
    $log.debug('WithdrawalStateController');
    var vm = this;
    vm.withdrawal = '';

    vm.withdraw = function() {
      var withdrawal = parseInt(vm.withdrawal);

      var promise = $q(function(resolve, reject) {
        ATMCtx.atmuser.withdrawal = vm.withdrawal;
        ATMCtx.atmuser.$update(function(user) {
          ATMCtx.atmuser = user;
          resolve({nextState: 'report', params: {withdrawal: withdrawal}});
        }, function(reason) {
          if (reason.status === 400) {
            resolve({nextState: 'error', params: {error: ERRORS.NOCASH}});
          } else if (reason.status === 409) {
            resolve({nextState: 'error', params: {error: ERRORS.CONCURRENCY}});
          } else {
            reject(reason);
          }
        });
      });

      $state.go('waiting', {promise: promise});
    };

    vm.back = function() {
      $state.go('main');
    };

    vm.exit = function() {
      $state.go('logout');
    };
  }])

  .controller('ReportStateController', ['$log', '$stateParams', 'ATMCtx',
      function ($log, $stateParams, ATMCtx) {
    $log.debug('ReportStateController');
    var vm = this;
    vm.withdrawal = $stateParams.withdrawal;
    vm.atmuser = ATMCtx.atmuser;
    vm.date = new Date(); // XXX need datetime for withdrawal operation
  }])

  .controller('ErrorStateController', ['$log', '$state', '$stateParams',
      function ($log, $state, $stateParams) {
    var vm = this;
    vm.error = $stateParams.error;
    vm.serverData = $stateParams.serverData;
  }])

  .controller('ATMKeyboardController', [function() {
    var vm = this;
    var maxLength = parseInt(vm.maxLength);

    vm.ready = false;
    vm.done = false;

    if (isNaN(maxLength) || (maxLength < 0)) {
      maxLength = 0;
    }

    var minLength = parseInt(vm.minLength);
    if (isNaN(minLength) || (minLength < 0)) {
      minLength = 0;
    }

    vm.isValid = function () {
      var len = vm.value.length;
      return (len >= minLength) && (!maxLength || (len <= maxLength));
    };

    function updateState() {
      vm.ready = (vm.value.length >= minLength);
      vm.done = (maxLength && (vm.value.length === maxLength));
    }

    vm.press = function(num) {
      if (!maxLength || (vm.value.length < maxLength)) {
        vm.value += num;
        updateState();
      }
    };

    vm.clear = function() {
      vm.value = '';
      updateState();
    };
  }])

  .run(['$http', '$state', 'ATMCtx', 'Auth', function($http, $state, ATMCtx, Auth) {
    $state.go('blank').then(function() {
      var promise = Auth.checkLogin()
        .then(function(result) {
          if (result) {
            return Auth.setATMUser().then(function() {
              return 'main';
            }, function() {
              return 'logout';
            });
          } else {
            return 'logincard';
          }
        });

      $state.go('waiting', {promise: promise});
    });
  }]);

