/// <reference path='../app.ts' />
/// <reference path='../services/_services.d.ts' />

namespace Hub {

  class Controller {
    public disableButtons: boolean; // for avoiding massive user clicks
    public loading: boolean = false;
    public session: Sessions.Session;

    private juPass: string;
    public lastProvidedLifeProff: Api.Answer;
    public lastLifeProffRequestTime: number;

    constructor(private $rootElement: ng.IRootElementService,private $scope: ng.IScope,private $timeout: ng.ITimeoutService,
        private $state: ng.ui.IStateService, private $q: ng.IQService, private sessionService: Sessions.Service,
        private hubService: Hub.Service,  private appStateService: AppState.Service) {
      this.loading = true
      this.init().then(() => {
        try { // if something unexpected happens angularjs wraps the error within the promise and shallow its
          this.setupWatchs();
          this.setupUI();
        } catch(err) {
          console.error(err) // ... so this way at least I log something here
          Toastr.error("Hubo un error con el navegador 😿")
          throw err
        }
      }).catch((err) => {
        console.error(err)
        Toastr.error("Hubo un error con el navegador 😿")
      }).finally(() => {
        this.loading = false
      })
    }

    private setupWatchs() {
      /*this.$scope.$watch(() => {
        return this.canCreateGame(this.sessionGame)
      }, (can) => {
        this.canCreateNewGame = !!can;
      })*/
    }

    private setupUI() {
      /*this.$rootElement.bind("keydown", (event) => {
        if(event.key === "Enter") {  // following convention at https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key#examples
            this.$timeout(() => {
              if (!_.isEmpty(this.sessionName)) {
                this.updateSessionName(this.sessionName)
              }
            });
            event.preventDefault();
        }
      });
      this.$scope.$on('$destroy', () => {
        this.$rootElement.unbind("keydown")
      });*/
    }

    private init() {
      const getClientSessionPromise = this.sessionService.getClientSession().then((session) => {
        this.session = session;
        this.lastLifeProffRequestTime = session.lastLifeProffRequestTime
        this.appStateService.set("clientSession", session)
        return session
      }).then(() => {
        return this.hubService.getLastProvidedLifeProff().then((answer) => {
          this.lastProvidedLifeProff = answer
          return answer
        })
      })
      return getClientSessionPromise

      /*return this.$q.all([getClientSessionPromise, getLastProvidedLasfProffPromise]).finally(() => {

      })*/
    }

    public requestLifeProff() {
      this.hubService.requestLifeProff().then((answer) => {
        Toastr.success("Solicitud de prueba de vida aceptada... ahora esperemos que responda")
        Sounds.playBroadcastMessage();
      }).catch((err) => {
          Toastr.warn("Solicitud de prueba de vida no aceptada: " + err.data)
      }).then(() => {
        this.updateLastProvidedLifeProff()
      })
      this.disableButtons = true;
      this.$timeout(() => {
        this.disableButtons = false;
      }, 2000)
    }

    public provideLifeProff() {
      this.hubService.provideLifeProff(this.juPass).then((answer) => {
        Toastr.success("Provisión de prueba de vida aceptada")
        Sounds.playBroadcastMessage();
      }).catch((err) => {
        Toastr.warn("Provisión de prueba de vida no aceptada: " + err.data)
      }).then(() => {
        this.updateLastProvidedLifeProff()
      })

      this.disableButtons = true;
      this.$timeout(() => {
        this.disableButtons = false;
      }, 2000)
    }

    public updateLastProvidedLifeProff() {
      this.hubService.getLastProvidedLifeProff().then((answer) => {
        this.lastProvidedLifeProff = answer
        this.lastLifeProffRequestTime = moment().unix()
      })

      this.disableButtons = true;
      this.$timeout(() => {
        this.disableButtons = false;
      }, 2000)
    }

    public openSendLifeProffDialog() {
      const dialog = document.getElementById('send-life-proff-dialog') as HTMLDialogElement;
      dialog.showModal()

    }

    public hideSendLifeProffDialog() {
      const dialog = document.getElementById('send-life-proff-dialog') as HTMLDialogElement;
      dialog.close();
    }

    public getAnImageFilename() {
      return Util.random(1,9) + ".jpg" // currently i have eight photos! from 1 to 8
    }
  }

  juknows.controller('HubController', ['$rootElement', '$scope', '$timeout','$state', '$q', 'SessionsService', 'HubService', 'AppStateService', Controller]);
}