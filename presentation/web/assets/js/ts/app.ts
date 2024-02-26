/// <reference path='./third_party_definitions/_definitions.ts' />
/// <reference path='./util.ts' />

const juknows: ng.IModule = angular.module('juknows', ['ui.router']);

module App {

  function setup($state: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider, $location: angular.ILocationProvider) {
    $location.html5Mode({ enabled: true, requireBase: false });
    $urlRouterProvider.otherwise('/');

    const hub: ng.ui.IState = {
      name: 'hub',
      templateUrl: '/presentation/web/assets/html/hub.html',
      controller: "HubController",
      controllerAs: "ctr"
    };

    $state.state(hub);
  };

  juknows.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', setup]);
}

juknows.run(['$state', ($state: ng.ui.IStateService) => {
  $state.go("hub"); // so on landing it goes straight to the hub
}])


// Wraps toastr calls using site "custom look and feel" parameters
namespace Toastr {

  export function success(message: string) {
    return toastr.success(message, '', {
      positionClass: 'toast-bottom-left',
      toastClass: "toast-container",
    });
  }

  export function info(message: string, customOptions?: ToastrOptions) {
    const options = _.extend( {
      positionClass: 'toast-bottom-left',
      toastClass: "toast-container",
    },customOptions)
    return toastr.info(message, '',options);
  }

  export function warn(message: string) {
    return toastr.warning(message, '', {
      positionClass: 'toast-bottom-left',
      toastClass: "toast-container",
    });
  }

  export function error(message: string) {
    return toastr.error(message, '', {
      positionClass: 'toast-bottom-left',
      toastClass: "toast-container",
    });
  }

  export function clear() {
    return toastr.clear();
  }
}


// motivation from (not STOLEN :P):
// http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/ && https://github.com/chieffancypants/angular-loading-bar
juknows.factory('progressLineInterceptor', ['$q', function ($q: ng.IQService) {
  let progressLine: any;
  var counter = 0;
  const progressLineInterceptor = {
    request: function (config: ng.IRequestConfig) {
      progressLine = $("#progress-line");
      progressLine.css('display', 'flex');
      counter++;
      return config;
    },
    response: function (response: ng.IHttpPromiseCallbackArg<any>) {
      progressLine = $("#progress-line");
      counter--;
      if (counter === 0) {
        progressLine.css('display', 'none');
      }
      return response;
    },
    responseError: function (rejection: ng.IHttpPromiseCallbackArg<any>) {
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

juknows.config(['$httpProvider', function ($httpProvider: ng.IHttpProvider) {
  $httpProvider.interceptors.push('progressLineInterceptor');
}]);