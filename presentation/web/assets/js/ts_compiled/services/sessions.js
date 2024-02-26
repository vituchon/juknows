/// <reference path='../app.ts' />
/// <reference path='../api-model.ts' />
var Sessions;
(function (Sessions) {
    class Service {
        constructor($http, $q) {
            this.$http = $http;
            this.$q = $q;
        }
        getSessions() {
            return this.$http.get(`/api/v1/sessions`).then((response) => {
                return response.data;
            });
        }
        getClientSession() {
            return this.$http.get(`/api/v1/session`).then((response) => {
                return response.data;
            });
        }
        updateSession(session) {
            return this.$http.put(`/api/v1/sessions/${session.id}`, session).then((response) => {
                return response.data;
            });
        }
        deleteSession(session) {
            return this.$http.delete(`/api/v1/sessions/${session.id}`).then((_) => {
                return null;
            });
        }
    }
    Sessions.Service = Service;
    juknows.service('SessionsService', ['$http', '$q', Service]);
})(Sessions || (Sessions = {}));
