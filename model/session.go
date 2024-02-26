package model

// A well-known web-client computer
type Session struct {
	Id                       int    `json:"id"`
	Alias                    string `json:"alias"`
	LastLifeProffRequestTime int64  `json:"lastLifeProffRequestTime"` // in seconds, since epoch (a.k.a. "unix time")
}
