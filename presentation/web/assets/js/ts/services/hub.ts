/// <reference path='../app.ts' />
/// <reference path='../api-model.ts' />

namespace Hub {

  export interface Answer extends Api.Answer {
  }

  export class Service {

    constructor(private $http: ng.IHttpService, private $q: ng.IQService) {
    }

    requestLifeProff() {
      return this.$http.post<Api.Answer>(`/api/v1/request-life-proff`, null).then((response) => {
        return <Answer>response.data;
      })
    }

    provideLifeProff(juPass: string) {
      const data = {
        password: juPass
      }
      const config: ng.IRequestShortcutConfig = {
        data: data
      };
      return this.$http.post<Api.Answer>(`/api/v1/provide-life-proff`, data, config).then((response) => {
        return <Answer>response.data;
      })
    }

    getLastProvidedLifeProff() {
      return this.$http.get<Api.Answer>(`/api/v1/last-provided-life-proff`).then((response) => {
        return <Answer>response.data;
      })
    }
  }

  juknows.service('HubService', ['$http', '$q', Service]);
}
