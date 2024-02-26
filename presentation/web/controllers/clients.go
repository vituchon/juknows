package controllers

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/sessions"
)

var clientSessions *sessions.CookieStore

func InitSessionStore(key []byte) {
	clientSessions = sessions.NewCookieStore(key)
}

var clientSequenceId int = 0
var mutex sync.Mutex

func GetOrCreateClientSession(request *http.Request) (*sessions.Session, error) {
	mutex.Lock()
	defer mutex.Unlock()

	clientSession, err := clientSessions.Get(request, "client_session")
	if err != nil {
		log.Printf("Error while getting client session from cookie store: '%v'. Ignoring...\n", err)
		//return nil, err // ignoring error following advice at https://github.com/gorilla/sessions/issues/16#issuecomment-143642144
	}
	if clientSession.IsNew {
		nextId := clientSequenceId + 1
		clientSession.Values["clientId"] = nextId
		clientSequenceId++
	}
	return clientSession, nil
}

func SaveClientSession(request *http.Request, response http.ResponseWriter, clientSession *sessions.Session) error {
	return clientSessions.Save(request, response, clientSession)
}

func GetClientSessionId(request *http.Request) int {
	clientSession, _ := GetOrCreateClientSession(request)
	wrappedInt, _ := clientSession.Values["clientId"]
	return wrappedInt.(int)
}
