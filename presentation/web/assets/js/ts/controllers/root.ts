/// <reference path='../app.ts' />
/// <reference path='../api-model.ts' />

namespace Root {

  export class Controller {

    public currentStatename: string;

    constructor(private $scope: ng.IScope, private appStateService: AppState.Service) {
    }

    public $onInit() {
      this.$scope.$on('$stateChangeSuccess', (event :ng.IAngularEvent, toState: ng.ui.IState, toParams, fromState, fromParams) => {
        this.currentStatename = toState.name
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

  juknows.controller('rootController', ['$scope', 'AppStateService', Controller]);
}
