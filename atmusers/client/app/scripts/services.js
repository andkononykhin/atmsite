'use strict';

angular.module('clientApp')

  .constant('CARD_NUMBER_LEN', 16)

  .constant('PIN_CODE_LEN', 4)

  .constant('PIN_CODE_CHAR', '*')

  .constant('MAX_ERROR_PIN_TRIES', 4)

  .constant('ERRORS', {
    UNKNOWN: {message: 'Ошибка сервиса', actionName: 'Выход', nextState: 'logout'},
    NODATA: {message: 'Нет данных', actionName: 'Выход', nextState: 'logout'},
    NOCARD: {message: 'Неизвестная карта', actionName: 'Назад', nextState: 'logincard'},
    PIN: {message: 'Неверный PIN код', actionName: 'Назад', nextState: 'loginpin'},
    CARD_BLOCKED:
      {message: 'Карта заблокирована', actionName: 'Выход', nextState: 'logincard'},
    CARD_HAS_BEEN_BLOCKED:
      {message: 'Карта была заблокирована', actionName: 'Выход', nextState: 'logout'},
    NOCASH:
      {message: 'Недостаточно средств', actionName: 'Назад', nextState: 'withdrawal'},
    CONCURRENCY:
      {message: 'Конфликт транзакций', actionName: 'Назад', nextState: 'withdrawal'},
    FORBIDDEN: {message: 'Ошибка авторизации', actionName: 'Выход', nextState: 'logout'},
  })

  .value('ATMCtx', {atmuser: null, card: null, errorPinCount: 0})

  .factory('ATMUser', ['$resource', function($resource) {
    return $resource('/api/atmusers/:card/',
      {card: '@card'}, {'update': { method:'PATCH' }});
  }])

  .factory('Auth', ['$http', '$q', 'ATMUser', 'ATMCtx', 'ERRORS',
      function($http, $q, ATMUser, ATMCtx, ERRORS) {

    var checkLogin = function() {
      return $http.head('/api/login/').then(function(result) {
        return result.status === 200;
      });
    };

    var checkATMUser = function(card) {
      return $http.head('/api/login/' + card);
    };

    var login = function(card, pin) {
      return $http.post('/api/login/', {card: card, password: pin});
    };

    var logout = function() {
      return $http.post('/api/logout/');
    };

    var setATMUser = function(card) {
      return $q(function(resolve, reject) {
        var promise;
        if (angular.isDefined(card)) {
          promise = ATMUser.get({card: card}, function(user) {
            ATMCtx.atmuser = user;
            resolve(ATMCtx.atmuser);
          }).$promise;
        } else {
          promise = ATMUser.query(function(users) {
            if (angular.isDefined(users[0])) {
              ATMCtx.atmuser = users[0];
              resolve(ATMCtx.atmuser);
            } else {
              resolve({nextState: 'error', params: {error: ERRORS.NODATA}});
            }
          }).$promise;
        }

        promise['catch'](function(reason) {
          reject(reason);
        });
      });
    };

    var blockATMUser = function(card) {
      return $http.post('/api/blockcard/', {card: card});
    };

    return {
      checkLogin: checkLogin,
      checkATMUser: checkATMUser,
      login: login,
      logout: logout,
      setATMUser: setATMUser,
      blockATMUser: blockATMUser,
    };
  }]);
