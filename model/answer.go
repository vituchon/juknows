package model

import (
	"os"
	//"fmt"
)

type Answer struct {
	Status  string `json:"status"`
	Details string `json:"details"`
	Time    int64  `json:"time"` // in seconds, since epoch (a.k.a. "unix time")
}

var juPass string

func init() {
	juPass = os.Getenv("JU_PASS")
	//fmt.Println("JU_PASS",juPass)
}

func IsValidJuPass(str string) bool {
	//fmt.Println("JU_PASS",juPass)
	//fmt.Println("str",str)
	return str == juPass
}
