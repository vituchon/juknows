/// <reference path='../app.ts' />
/// <reference path='../api-model.ts' />

namespace Sessions {

  export interface Session extends Api.Session {
  }

  export class Service {
    constructor(private $http: ng.IHttpService, private $q: ng.IQService) {
    }

    getSessions(): ng.IPromise<Session[]> {
      return this.$http.get<Session[]>(`/api/v1/sessions`).then((response) => {
        return response.data;
      });
    }

    getClientSession(): ng.IPromise<Session> {
      return this.$http.get<Session>(`/api/v1/session`).then((response) => {
        return response.data;
      })
    }

    updateSession(session: Session): ng.IPromise<Session> {
      return this.$http.put<Session>(`/api/v1/sessions/${session.id}`,session).then((response) => {
        return response.data
      })
    }

    deleteSession(session: Session): ng.IPromise<any> {
      return this.$http.delete<any>(`/api/v1/sessions/${session.id}`).then((_) => {
        return null;
      })
    }

  }

  juknows.service('SessionsService', ['$http', '$q', Service]);
}
