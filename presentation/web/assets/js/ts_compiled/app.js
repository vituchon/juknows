/// <reference path='./third_party_definitions/_definitions.ts' />
/// <reference path='./util.ts' />
const juknows = angular.module('juknows', ['ui.router']);
var App;
(function (App) {
    function setup($state, $urlRouterProvider, $location) {
        $location.html5Mode({ enabled: true, requireBase: false });
        $urlRouterProvider.otherwise('/');
        const hub = {
            name: 'hub',
            templateUrl: '/presentation/web/assets/html/hub.html',
            controller: "HubController",
            controllerAs: "ctr"
        };
        $state.state(hub);
    }
    ;
    juknows.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', setup]);
})(App || (App = {}));
juknows.run(['$state', ($state) => {
        $state.go("hub"); // so on landing it goes straight to the hub
    }]);
// Wraps toastr calls using site "custom look and feel" parameters
var Toastr;
(function (Toastr) {
    function success(message) {
        return toastr.success(message, '', {
            positionClass: 'toast-bottom-left',
            toastClass: "toast-container",
        });
    }
    Toastr.success = success;
    function info(message, customOptions) {
        const options = _.extend({
            positionClass: 'toast-bottom-left',
            toastClass: "toast-container",
        }, customOptions);
        return toastr.info(message, '', options);
    }
    Toastr.info = info;
    function warn(message) {
        return toastr.warning(message, '', {
            positionClass: 'toast-bottom-left',
            toastClass: "toast-container",
        });
    }
    Toastr.warn = warn;
    function error(message) {
        return toastr.error(message, '', {
            positionClass: 'toast-bottom-left',
            toastClass: "toast-container",
        });
    }
    Toastr.error = error;
    function clear() {
        return toastr.clear();
    }
    Toastr.clear = clear;
})(Toastr || (Toastr = {}));
// motivation from (not STOLEN :P):
// http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/ && https://github.com/chieffancypants/angular-loading-bar
juknows.factory('progressLineInterceptor', ['$q', function ($q) {
        let progressLine;
        var counter = 0;
        const progressLineInterceptor = {
            request: function (config) {
                progressLine = $("#progress-line");
                progressLine.css('display', 'flex');
                counter++;
                return config;
            },
            response: function (response) {
                progressLine = $("#progress-line");
                counter--;
                if (counter === 0) {
                    progressLine.css('display', 'none');
                }
                return response;
            },
            responseError: function (rejection) {
                progressLine = $("#progress-line");
                counter--;
                if (counter === 0) {
                    progressLine.css('display', 'none');
                }
                return $q.reject(rejection);
            }
        };
        return progressLineInterceptor;
    }]);
juknows.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('progressLineInterceptor');
    }]);
