/// <reference path='../app.ts' />
/// <reference path='../services/_services.d.ts' />
var Hub;
(function (Hub) {
    class Controller {
        constructor($rootElement, $scope, $timeout, $state, $q, sessionService, hubService, appStateService) {
            this.$rootElement = $rootElement;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$q = $q;
            this.sessionService = sessionService;
            this.hubService = hubService;
            this.appStateService = appStateService;
            this.loading = false;
            this.loading = true;
            this.init().then(() => {
                try { // if something unexpected happens angularjs wraps the error within the promise and shallow its
                    this.setupWatchs();
                    this.setupUI();
                }
                catch (err) {
                    console.error(err); // ... so this way at least I log something here
                    Toastr.error("Hubo un error con el navegador 😿");
                    throw err;
                }
            }).catch((err) => {
                console.error(err);
                Toastr.error("Hubo un error con el navegador 😿");
            }).finally(() => {
                this.loading = false;
            });
        }
        setupWatchs() {
            /*this.$scope.$watch(() => {
              return this.canCreateGame(this.sessionGame)
            }, (can) => {
              this.canCreateNewGame = !!can;
            })*/
        }
        setupUI() {
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
        init() {
            const getClientSessionPromise = this.sessionService.getClientSession().then((session) => {
                this.session = session;
                this.lastLifeProffRequestTime = session.lastLifeProffRequestTime;
                this.appStateService.set("clientSession", session);
                return session;
            }).then(() => {
                return this.hubService.getLastProvidedLifeProff().then((answer) => {
                    this.lastProvidedLifeProff = answer;
                    return answer;
                });
            });
            return getClientSessionPromise;
            /*return this.$q.all([getClientSessionPromise, getLastProvidedLasfProffPromise]).finally(() => {
      
            })*/
        }
        requestLifeProff() {
            this.hubService.requestLifeProff().then((answer) => {
                Toastr.success("Solicitud de prueba de vida aceptada... ahora esperemos que responda");
                Sounds.playBroadcastMessage();
            }).catch((err) => {
                Toastr.warn("Solicitud de prueba de vida no aceptada: " + err.data);
            }).then(() => {
                this.updateLastProvidedLifeProff();
            });
            this.disableButtons = true;
            this.$timeout(() => {
                this.disableButtons = false;
            }, 2000);
        }
        provideLifeProff() {
            this.hubService.provideLifeProff(this.juPass).then((answer) => {
                Toastr.success("Provisión de prueba de vida aceptada");
                Sounds.playBroadcastMessage();
            }).catch((err) => {
                Toastr.warn("Provisión de prueba de vida no aceptada: " + err.data);
            }).then(() => {
                this.updateLastProvidedLifeProff();
            });
            this.disableButtons = true;
            this.$timeout(() => {
                this.disableButtons = false;
            }, 2000);
        }
        updateLastProvidedLifeProff() {
            this.hubService.getLastProvidedLifeProff().then((answer) => {
                this.lastProvidedLifeProff = answer;
                this.lastLifeProffRequestTime = moment().unix();
            });
            this.disableButtons = true;
            this.$timeout(() => {
                this.disableButtons = false;
            }, 2000);
        }
        openSendLifeProffDialog() {
            const dialog = document.getElementById('send-life-proff-dialog');
            dialog.showModal();
        }
        hideSendLifeProffDialog() {
            const dialog = document.getElementById('send-life-proff-dialog');
            dialog.close();
        }
        getAnImageFilename() {
            return Util.random(1, 9) + ".jpg"; // currently i have eight photos! from 1 to 8
        }
    }
    juknows.controller('HubController', ['$rootElement', '$scope', '$timeout', '$state', '$q', 'SessionsService', 'HubService', 'AppStateService', Controller]);
})(Hub || (Hub = {}));
