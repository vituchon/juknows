package repositories

import (
	"sync"

	"github.com/vituchon/juknows/model"
)


type SessionsMemoryRepository struct {
	sessionsById map[int]model.Session
	mutex       sync.Mutex
}

func NewSessionsMemoryRepository() *SessionsMemoryRepository {
	return &SessionsMemoryRepository{sessionsById: make(map[int]model.Session)}
}

func (repo *SessionsMemoryRepository) GetSessions() ([]model.Session, error) {
	repo.mutex.Lock()
	defer repo.mutex.Unlock()
	sessions := make([]model.Session, 0, len(repo.sessionsById))
	for _, session := range repo.sessionsById {
		sessions = append(sessions, session)
	}
	return sessions, nil
}

func (repo *SessionsMemoryRepository) GetSessionById(id int) (*model.Session, error) {
	repo.mutex.Lock()
	defer repo.mutex.Unlock()
	session, exists := repo.sessionsById[id]
	if !exists {
		return nil, EntityNotExistsErr
	}
	return &session, nil
}

func (repo *SessionsMemoryRepository) CreateSession(session model.Session) (created *model.Session, err error) {
	repo.mutex.Lock()
	defer repo.mutex.Unlock()
	repo.sessionsById[session.Id] = session
	return &session, nil
}

func (repo *SessionsMemoryRepository) UpdateSession(session model.Session) (updated *model.Session, err error) {
	repo.mutex.Lock()
	defer repo.mutex.Unlock()
	repo.sessionsById[session.Id] = session
	return &session, nil
}

func (repo *SessionsMemoryRepository) DeleteSession(id int) error {
	repo.mutex.Lock()
	defer repo.mutex.Unlock()
	delete(repo.sessionsById, id)
	return nil
}
