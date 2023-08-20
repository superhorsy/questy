package model

import (
	"regexp"
)

type LoginForm struct {
	Password string `json:"password"`
	Email    string `json:"email"`
}

type RegistrationRequest struct {
	Name     string `json:"nickname"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type Validation struct {
	Value string
	Valid string
	Error error
}

type UserWithToken struct {
	*User
	AccessToken string `json:"access_token,omitempty"`
}

func Validate(values []Validation) error {
	username := regexp.MustCompile(`^([A-Za-z0-9]{5,})+$`)
	email := regexp.MustCompile(`^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`)

	for i := 0; i < len(values); i++ {
		switch values[i].Valid {
		case "username":
			if !username.MatchString(values[i].Value) {
				return values[i].Error
			}
		case "email":
			if !email.MatchString(values[i].Value) {
				return values[i].Error
			}
		case "password":
			if len(values[i].Value) < 5 {
				return values[i].Error
			}
		}
	}
	return nil
}
