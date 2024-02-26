/// <reference path='../app.ts' />
/// <reference path='../api-model.ts' />
var AppState;
(function (AppState) {
    class Service {
        constructor() {
            this.clear();
        }
        set(key, value) {
            this.state[key] = value;
        }
        ;
        get(key) {
            return this.state[key];
        }
        ;
        clear() {
            this.state = {};
        }
        ;
    }
    AppState.Service = Service;
    juknows.service('AppStateService', [Service]);
})(AppState || (AppState = {}));
