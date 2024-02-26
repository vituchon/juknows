/// <reference path='../app.ts' />
/// <reference path='../api-model.ts' />


namespace AppState {


  export class Service {
    private state: {
      [key:string]: any;
    }
    constructor() {
      this.clear();
    }

    public set<T>(key: string, value:T) {
      this.state[key] = value;
    };

    public get<T>(key: string): T {
      return this.state[key]
    };

    public clear() {
      this.state = {};
    };

  }

  juknows.service('AppStateService', [Service]);
}
