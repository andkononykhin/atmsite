'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngCookies',
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'clientAppTpl'
  ])

  .config(['$logProvider', function($logProvider) {
    $logProvider.debugEnabled(false);
  }])

  .config(['$resourceProvider', function($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }])

  .config(['$locationProvider',function config($locationProvider) {
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }])

  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  }])

  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

    var blankState = {
      name: 'blank',
      url: '/',
      template: '',
    };

    var loginCardState = {
      name: 'logincard',
      url: '/logincard',
      templateUrl: 'views/login_card.html',
      controller: 'LoginCardStateController',
      controllerAs: 'vm'
    };

    var loginPinState = {
      name: 'loginpin',
      url: '/loginpin',
      templateUrl: 'views/login_pin.html',
      controller: 'LoginPinStateController',
      controllerAs: 'vm',
    };

    var logoutState = {
      name: 'logout',
      url: '/logout',
      controller: 'LogoutStateController',
      controllerAs: 'vm',
    };

    var mainState = {
      name: 'main',
      url: '/main',
      templateUrl: 'views/main.html'
    };

    var balanceState = {
      name: 'balance',
      url: '/balance',
      templateUrl: 'views/balance.html',
      controller: 'BalanceStateController',
      controllerAs: 'vm',
    };

    var withdrawalState = {
      name: 'withdrawal',
      url: '/withdrawal',
      templateUrl: 'views/withdrawal.html',
      controller: 'WithdrawalStateController',
      controllerAs: 'vm',
    };

    var reportState = {
      name: 'report',
      url: '/report',
      params: {
        withdrawal: null
      },
      templateUrl: 'views/report.html',
      controller: 'ReportStateController',
      controllerAs: 'vm',
    };

    var errorState = {
      name: 'error',
      url: '/error',
      params: {
        error: null,
        serverData: null,
      },
      templateUrl: 'views/error.html',
      controller: 'ErrorStateController',
      controllerAs: 'vm',
    };

    var waitingState = {
      name: 'waiting',
      url: '/waiting',
      params: {
        promise: null
      },
      onEnter: ['$log', '$q', '$stateParams', '$state', '$uibModal', '$timeout', 'ERRORS',
          function($log, $q, $stateParams, $state, $uibModal, $timeout, ERRORS) {
    
        $log.debug('Entered waiting state');

        var mWaiting;
        var FAST_ENOUGH = 1000; /* ms, in case of longer awaiting show circular progress */

        var timeoutPromise = $timeout(function() {
          $log.debug('Timeout, start waiting modal');
          mWaiting = $uibModal.open({
            templateUrl: 'views/waiting.html',
            backdrop: 'static',
            keyboard: false,
            size: 'sm',
          });
        }, FAST_ENOUGH);

        if (!$stateParams.promise) {
          $log.warn('promise is not defined');
          $stateParams.promise = $q.resolve({nextState: 'error',
            params: {error: ERRORS.UNKNOWN}});
        }

        $stateParams.promise.then(function(nextState) {
          $log.debug(nextState);

          if (angular.isString(nextState)) {
            $state.go(nextState);
          } else {
            $state.go(nextState.nextState, nextState.params);
          }
        }, function (reason) {
          if (reason.status === 401 || reason.status === 403) {
            $state.go('error', {error: ERRORS.FORBIDDEN});
          } else {
            $state.go('error', {error: ERRORS.UNKNOWN, serverData: reason.data});
          }
        })['finally'](function() {
          $timeout.cancel(timeoutPromise);
          if (mWaiting) {
            $log.debug('stop waiting modal');
            mWaiting.close();
          }
        });
      }]
    };

    $stateProvider.state(blankState);
    $stateProvider.state(loginCardState);
    $stateProvider.state(loginPinState);
    $stateProvider.state(logoutState);
    $stateProvider.state(mainState);
    $stateProvider.state(balanceState);
    $stateProvider.state(withdrawalState);
    $stateProvider.state(reportState);
    $stateProvider.state(errorState);
    $stateProvider.state(waitingState);

    $urlRouterProvider.otherwise('/');
  }]);
