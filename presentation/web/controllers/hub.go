package controllers

import (
	"fmt"
	"log"
	"net/http"

	"strconv"
	"time"

	"github.com/vituchon/juknows/model"
	"github.com/vituchon/juknows/repositories"
)

var hubRepository repositories.Hub = repositories.NewHubMemoryRepository()

func RequestLifeProff(response http.ResponseWriter, request *http.Request) {
	id := GetClientSessionId(request)
	session, err := sessionsRepository.GetSessionById(id) // ver "es discutible..." abajo...
	if err != nil {
		errMsg := fmt.Sprintf("error while retrieving session(id=%d): '%v'", id, err)
		log.Println(errMsg)
		http.Error(response, errMsg, http.StatusInternalServerError)
		return
	}

	session.LastLifeProffRequestTime = time.Now().Unix()
	session, err = sessionsRepository.UpdateSession(*session)
	if err != nil {
		errMsg := fmt.Sprintf("error while updating session(id=%d): '%v'", id, err)
		log.Println(errMsg)
		http.Error(response, errMsg, http.StatusInternalServerError)
		return
	}

	var answer model.Answer = model.Answer{
		Status:  "Ok",
		Details: "requester-session-id:" + strconv.Itoa(session.Id),
		Time:    time.Now().Unix(),
	}
	WriteJsonResponse(response, http.StatusOK, answer)
}

func ProvideLifeProff(response http.ResponseWriter, request *http.Request) {
	id := GetClientSessionId(request)
	session, err := sessionsRepository.GetSessionById(id) // es discutible, estoy usando el número de cliente (asociado via cookie indirecamente...) con el número de sesión... bueno no hay sesiones a nivel programa pues no hay autenticación más que las cookies, lo que hay es una pseudo-sesion que se implementa con los encabezados que agrega un web browser a las solicitudes http
	if err != nil {
		errMsg := fmt.Sprintf("error while retrieving session(id=%d): '%v'", id, err)
		log.Println(errMsg)
		http.Error(response, errMsg, http.StatusInternalServerError)
		return
	}

	type LifeProff struct {
		Password string `json:"password"`
	}
	var lifeProff LifeProff
	err = parseJsonFromReader(request.Body, &lifeProff)
	if err != nil {
		errMsg := fmt.Sprintf("error reading request body: '%v'", err)
		log.Println(errMsg)
		http.Error(response, errMsg, http.StatusBadRequest)
		return
	}

	isValidJuPass := model.IsValidJuPass(lifeProff.Password)
	if !isValidJuPass {
		errMsg := "provided password was not valid"
		log.Println(errMsg)
		http.Error(response, errMsg, http.StatusUnauthorized)
		return
	}
	var answer model.Answer = model.Answer{
		Status:  "Ok",
		Details: "requester-session-id:" + strconv.Itoa(session.Id),
		Time:    time.Now().Unix(),
	}

	_, err = hubRepository.SetLastProvidedLifeProff(answer)
	if err != nil {
		errMsg := fmt.Sprintf("error while setting last provided life proff: '%v'", err)
		log.Println(errMsg)
		http.Error(response, errMsg, http.StatusInternalServerError)
		return
	}
	WriteJsonResponse(response, http.StatusOK, answer)
}

func GetLastProvidedLifeProff(response http.ResponseWriter, request *http.Request) {
	id := GetClientSessionId(request)
	_, err := sessionsRepository.GetSessionById(id) // es discutible, estoy usando el número de cliente (asociado via cookie indirecamente...) con el número de sesión... bueno no hay sesiones a nivel programa pues no hay autenticación más que las cookies, lo que hay es una pseudo-sesion que se implementa con los encabezados que agrega un web browser a las solicitudes http
	if err != nil {
		errMsg := fmt.Sprintf("error while retrieving session(id=%d): '%v'", id, err)
		log.Println(errMsg)
		http.Error(response, errMsg, http.StatusInternalServerError)
		return
	}

	answer, err := hubRepository.GetLastProvidedLifeProff()
	if err != nil {
		errMsg := fmt.Sprintf("error while getting last provided life proff: '%v'", err)
		log.Println(errMsg)
		http.Error(response, errMsg, http.StatusInternalServerError)
		return
	}
	WriteJsonResponse(response, http.StatusOK, answer)
}
