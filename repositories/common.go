package repositories

import (
	"errors"

	"github.com/vituchon/juknows/model"
)

var EntityNotExistsErr error = errors.New("Entity doesn't exists")
var DuplicatedEntityErr error = errors.New("Duplicated Entity")
var InvalidEntityStateErr error = errors.New("Entity state is invalid")

type Sessions interface {
	GetSessions() ([]model.Session, error)
	GetSessionById(id int) (*model.Session, error)
	CreateSession(session model.Session) (created *model.Session, err error)
	UpdateSession(session model.Session) (updated *model.Session, err error)
	DeleteSession(id int) error
}

type Hub interface {
	GetLastProvidedLifeProff() (*model.Answer, error)
	SetLastProvidedLifeProff(answer model.Answer) (*model.Answer, error)
}
