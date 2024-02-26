package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/vituchon/juknows/model"

	"github.com/vituchon/juknows/repositories"
)

var sessionsRepository repositories.Sessions = repositories.NewSessionsMemoryRepository()

func GetSessions(response http.ResponseWriter, request *http.Request) {
	sessions, err := sessionsRepository.GetSessions()
	if err != nil {
		log.Printf("error while retrieving sessions : '%v'", err)
		response.WriteHeader(http.StatusInternalServerError)
		return
	}
	WriteJsonResponse(response, http.StatusOK, sessions)
}

// Gets the web client's correspondant session (There is only ONE session per client!)
func GetClientSession(response http.ResponseWriter, request *http.Request) {
	id := GetClientSessionId(request)
	session, err := sessionsRepository.GetSessionById(id)
	if err != nil {
		if err == repositories.EntityNotExistsErr {
			alias := ""
			paramAlias, err := ParseSingleStringUrlQueryParam(request, "alias")
			if err != nil && paramAlias != nil {
				alias = *paramAlias
			} else {
				alias = "not-set"
			}
			session, err = createSession(id, alias) // create session in memory
			if err != nil {
				log.Printf("error while getting client session : '%v'", err)
				response.WriteHeader(http.StatusInternalServerError)
				return
			}
			_, err = sessionsRepository.CreateSession(*session) // saves session in a persistent storage
			if err != nil {
				log.Printf("error while getting client session : '%v'", err)
				response.WriteHeader(http.StatusInternalServerError)
				return
			}
			log.Printf("Creating new session %+v \n", session)
		} else {
			log.Printf("error while getting client session : '%v'", err)
			response.WriteHeader(http.StatusInternalServerError)
			return
		}
	} else {
		log.Printf("Using existing session %+v \n", session)
	}
	WriteJsonResponse(response, http.StatusOK, session)
}

func createSession(id int, alias string) (*model.Session, error) {
	return &model.Session{
		Alias: alias,
		Id:    id,
	}, nil
}

func GetSessionById(response http.ResponseWriter, request *http.Request) {
	paramId := RouteParam(request, "id")
	id, err := strconv.Atoi(paramId)
	if err != nil {
		log.Printf("Can not parse id from '%s'", paramId)
		response.WriteHeader(http.StatusBadRequest)
		return
	}
	session, err := sessionsRepository.GetSessionById(id)
	if err != nil {
		log.Printf("error while retrieving session(id=%d): '%v'\n", id, err)
		response.WriteHeader(http.StatusInternalServerError)
		return
	}
	WriteJsonResponse(response, http.StatusOK, session)
}

func UpdateSession(response http.ResponseWriter, request *http.Request) {
	var session model.Session
	err := parseJsonFromReader(request.Body, &session)
	if err != nil {
		log.Printf("error reading request body: '%v'", err)
		response.WriteHeader(http.StatusBadRequest)
		return
	}
	updated, err := sessionsRepository.UpdateSession(session)
	if err != nil {
		log.Printf("error while updating Session: '%v'", err)
		response.WriteHeader(http.StatusInternalServerError)
		return
	}
	WriteJsonResponse(response, http.StatusOK, updated)
}

func DeleteSession(response http.ResponseWriter, request *http.Request) {
	paramId := RouteParam(request, "id")
	id, err := strconv.Atoi(paramId)
	if err != nil {
		log.Printf("Can not parse id from '%s'", paramId)
		response.WriteHeader(http.StatusBadRequest)
		return
	}
	err = sessionsRepository.DeleteSession(id)
	if err != nil {
		log.Printf("error while deleting session(id=%d): '%v'", id, err)
		response.WriteHeader(http.StatusInternalServerError)
		return
	}
	response.WriteHeader(http.StatusOK)
}
