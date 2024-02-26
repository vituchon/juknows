/// <reference path='../app.ts' />
/// <reference path='../api-model.ts' />
var Root;
(function (Root) {
    class Controller {
        constructor($scope, appStateService) {
            this.$scope = $scope;
            this.appStateService = appStateService;
        }
        $onInit() {
            this.$scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
                this.currentStatename = toState.name;
            });
            /*this.$scope.$watch(() => {
              return this.appStateService.get<Api.Game>("currentGame")
            }, (currentGame) => {
              if (!_.isUndefined(currentGame)) {
                this.currentGame = currentGame
              }
            })*/
        }
    }
    Root.Controller = Controller;
    juknows.controller('rootController', ['$scope', 'AppStateService', Controller]);
})(Root || (Root = {}));
