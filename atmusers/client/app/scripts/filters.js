'use strict';


angular.module('clientApp')

  .filter('cardNumber', function() {
    return function(input) {
      input = input || '';
      var output = '';
      for (var i = 1; i <= input.length; i++) {
        output += input.charAt(i-1);
        if (i < 16 && (i % 4 === 0)) {
          output += '-';
        }
      }
      return output;
    };
  })

  .filter('pinCode', ['PIN_CODE_CHAR', function(PIN_CODE_CHAR) {
    return function(input) {
      return (new Array((input || '').length + 1).join(PIN_CODE_CHAR));
    };
  }]);
