package repositories

import (
	"github.com/vituchon/juknows/model"
)

type HubMemoryRepository struct {
	lastProvidedLifeProff model.Answer
}

func NewHubMemoryRepository() *HubMemoryRepository {
	return &HubMemoryRepository{}
}

func (repo *HubMemoryRepository) GetLastProvidedLifeProff() (*model.Answer, error) {
	return &repo.lastProvidedLifeProff, nil
}

func (repo *HubMemoryRepository) SetLastProvidedLifeProff(answer model.Answer) (*model.Answer, error) {
	repo.lastProvidedLifeProff = answer
	return &repo.lastProvidedLifeProff, nil
}
