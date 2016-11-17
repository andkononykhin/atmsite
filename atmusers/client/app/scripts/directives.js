'use strict';


angular.module('clientApp')

  .directive('atmKeyboard', function() {
    return {
      restrict: 'EA',
      scope: {
        value: '=',
        minLength: '@?',
        maxLength: '@?',
        ok: '&onOk',
        back: '&?onBack',
        exit: '&?onExit',
      },
      templateUrl: 'views/keyboard.html',
      controller: 'ATMKeyboardController',
      controllerAs: 'vm',
      bindToController: true,
    };
  });
