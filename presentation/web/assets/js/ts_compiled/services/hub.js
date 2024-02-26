/// <reference path='../app.ts' />
/// <reference path='../api-model.ts' />
var Hub;
(function (Hub) {
    class Service {
        constructor($http, $q) {
            this.$http = $http;
            this.$q = $q;
        }
        requestLifeProff() {
            return this.$http.post(`/api/v1/request-life-proff`, null).then((response) => {
                return response.data;
            });
        }
        provideLifeProff(juPass) {
            const data = {
                password: juPass
            };
            const config = {
                data: data
            };
            return this.$http.post(`/api/v1/provide-life-proff`, data, config).then((response) => {
                return response.data;
            });
        }
        getLastProvidedLifeProff() {
            return this.$http.get(`/api/v1/last-provided-life-proff`).then((response) => {
                return response.data;
            });
        }
    }
    Hub.Service = Service;
    juknows.service('HubService', ['$http', '$q', Service]);
})(Hub || (Hub = {}));
