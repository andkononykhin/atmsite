angular.module('clientAppTpl', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/balance.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3\">\n" +
    "    <h1>Баланс</h1>\n" +
    "    <form role=\"form\" ng-submit=\"vm.login()\">\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"balance_card\">Номер карты</label>\n" +
    "        <span class=\"form-control\" id=\"balance_card\" ng-model=\"vm.atmuser.card\">\n" +
    "          {{ vm.atmuser.card | cardNumber }}\n" +
    "        </span>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"balance_date\">Текущая дата</label>\n" +
    "        <span class=\"form-control\" id=\"balance_date\" ng-model=\"vm.date\">\n" +
    "          {{ vm.date | date }}\n" +
    "        </span>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"balance_cash\">Остаток на счёте</label>\n" +
    "        <span class=\"form-control\" id=\"balance_cash\" ng-model=\"vm.atmuser.cash\">\n" +
    "          {{ vm.atmuser.cash | currency }}\n" +
    "        </span>\n" +
    "      </div>\n" +
    "\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 text-center\">\n" +
    "    <button ui-sref=\"main\" type=\"button\" class=\"btn btn-default btn-block\">Назад</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" ng-style=\"{'padding-top': '5px'}\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 text-center\">\n" +
    "    <button ui-sref=\"logout\" type=\"button\" class=\"btn btn-default btn-block\">Выход</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/error.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3\">\n" +
    "    <h1 class=\"text-danger\">Ошибка</h1>\n" +
    "    <h2>{{ vm.error.message }}</h2>\n" +
    "    <p ng-if=\"vm.serverData && vm.serverData.message\" class=\"bg-danger\">{{ vm.serverData.message }}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 text-center\">\n" +
    "    <button ui-sref=\"{{ vm.error.nextState }}\" type=\"button\" class=\"btn btn-default btn-block\">\n" +
    "      {{ vm.error.actionName  }}\n" +
    "    </button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('views/keyboard.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "    <button ng-disabled=\"vm.done\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.press('1')\">1</button>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "    <button ng-disabled=\"vm.done\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.press('2')\">2</button>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "    <button ng-disabled=\"vm.done\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.press('3')\">3</button>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-4 text-center padding-0\">\n" +
    "    <button ng-disabled=\"!vm.value\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.clear()\">Очистить</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "    <button ng-disabled=\"vm.done\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.press('4')\">4</button>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "    <button ng-disabled=\"vm.done\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.press('5')\">5</button>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "    <button ng-disabled=\"vm.done\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.press('5')\">6</button>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-4 text-center padding-0\">\n" +
    "    <button ng-disabled=\"!vm.ready\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.ok()\">\n" +
    "      OK\n" +
    "    </button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "    <button ng-disabled=\"vm.done\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.press('7')\">7</button>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "    <button ng-disabled=\"vm.done\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.press('8')\">8</button>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "    <button ng-disabled=\"vm.done\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.press('9')\">9</button>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-4 text-center padding-0\">\n" +
    "    <button ng-disabled=\"!vm.back\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.back()\">Назад</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "    <button ng-disabled=\"vm.done\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.press('0')\">0</button>\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-2 text-center padding-0\">\n" +
    "  </div>\n" +
    "  <div class=\"col-xs-4 text-center padding-0\">\n" +
    "    <button ng-disabled=\"!vm.exit\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.exit()\">Выход</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/login_card.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3\">\n" +
    "    <h1>Карта</h1>\n" +
    "    <form role=\"form\" ng-submit=\"vm.login()\">\n" +
    "\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-10 padding-0\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <span class=\"form-control\" id=\"login__card\">\n" +
    "              {{ vm.atmuser.card | cardNumber }}\n" +
    "            </span>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <atm-keyboard\n" +
    "        value=\"vm.atmuser.card\"\n" +
    "        min-length=\"{{ vm.CARD_NUMBER_LEN }}\"\n" +
    "        max-length=\"{{ vm.CARD_NUMBER_LEN }}\"\n" +
    "        on-ok=\"vm.login()\">\n" +
    "      </atm-keyboard>\n" +
    "\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('views/login_pin.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3\">\n" +
    "    <h1>PIN код</h1>\n" +
    "    <form role=\"form\" ng-submit=\"vm.login()\">\n" +
    "\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-10 padding-0\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <span class=\"form-control\" id=\"login__pin\">\n" +
    "              {{ vm.pin | pinCode }}\n" +
    "            </span>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <atm-keyboard\n" +
    "        value=\"vm.pin\"\n" +
    "        min-length=\"{{ vm.PIN_CODE_LEN }}\"\n" +
    "        max-length=\"{{ vm.PIN_CODE_LEN }}\"\n" +
    "        on-ok=\"vm.login()\"\n" +
    "        on-exit=\"vm.exit()\">\n" +
    "      </atm-keyboard>\n" +
    "\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('views/main.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3\">\n" +
    "    <h1>Операции</h1>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 text-center\">\n" +
    "    <button ui-sref=\"balance\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.inquiryBalance()\">Баланс</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" ng-style=\"{'padding-top': '5px'}\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 text-center\">\n" +
    "    <button ui-sref=\"withdrawal\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.withdrawCash()\">Снять сумму</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" ng-style=\"{'padding-top': '5px'}\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 text-center\">\n" +
    "    <button ui-sref=\"logout\" type=\"button\" class=\"btn btn-default btn-block\" ng-click=\"vm.exit()\">Выход</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/report.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3\">\n" +
    "    <h1>Отчёт</h1>\n" +
    "    <form role=\"form\" ng-submit=\"vm.login()\">\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"report_card\">Номер карты</label>\n" +
    "        <span class=\"form-control\" id=\"report_card\" ng-model=\"vm.atmuser.card\">\n" +
    "          {{ vm.atmuser.card | cardNumber }}\n" +
    "        </span>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"report_datetime\">Текущая дата и время</label>\n" +
    "        <span class=\"form-control\" id=\"report_datetime\" ng-model=\"vm.date\">\n" +
    "          {{ vm.date | date:'medium' }}\n" +
    "        </span>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"report_cash\">Сумма</label>\n" +
    "        <span class=\"form-control\" id=\"report_cash\" ng-model=\"vm.atmuser.cash\">\n" +
    "          {{ vm.withdrawal | currency }}\n" +
    "        </span>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"report_cash\">Остаток на счёте</label>\n" +
    "        <span class=\"form-control\" id=\"report_cash\" ng-model=\"vm.atmuser.cash\">\n" +
    "          {{ vm.atmuser.cash | currency }}\n" +
    "        </span>\n" +
    "      </div>\n" +
    "\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 text-center\">\n" +
    "    <button ui-sref=\"withdrawal\" type=\"button\" class=\"btn btn-default btn-block\">Назад</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" ng-style=\"{'padding-top': '5px'}\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 text-center\">\n" +
    "    <button ui-sref=\"logout\" type=\"button\" class=\"btn btn-default btn-block\">Выход</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/waiting.html',
    "<div class=\"modal-content\">\n" +
    "  <div class=\"modal-header container-fluid\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-6 col-md-offset-3\">\n" +
    "        <img src=\"/static/images/loading.gif\">\n" +
    "        <span class=\"text-center h5\">Ожидание</span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('views/withdrawal.html',
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-12 padding-0\">\n" +
    "        <h1>Снятие денег</h1>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-10 padding-0\">\n" +
    "        <form role=\"form\" ng-submit=\"vm.login()\">\n" +
    "\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"withdrawal_cash\">Сумма</label>\n" +
    "            <span class=\"form-control\" id=\"withdrawal_cash\">\n" +
    "              {{ vm.withdrawal | currency:undefined:0 }}\n" +
    "            </span>\n" +
    "          </div>\n" +
    "\n" +
    "        </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <atm-keyboard\n" +
    "      value=\"vm.withdrawal\"\n" +
    "      min-length=\"1\"\n" +
    "      on-ok=\"vm.withdraw()\"\n" +
    "      on-back=\"vm.back()\"\n" +
    "      on-exit=\"vm.exit()\">\n" +
    "    </atm-keyboard>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n"
  );

}]);
