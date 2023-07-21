package helpers

import (
	"context"
	"github.com/dgrijalva/jwt-go"
	"github.com/superhorsy/quest-app-frontend/backend/core/config"
	"github.com/superhorsy/quest-app-frontend/backend/core/errors"
	"golang.org/x/crypto/bcrypt"
	"os"
	"strings"
	"time"
)

func HashAndSalt(pass []byte) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword(pass, bcrypt.MinCost)
	return string(hashed), err
}

func CreateJwtToken(id string) (*string, error) {
	tokenContent := jwt.MapClaims{
		"sub": id,
		//"exp": time.Now().Add(time.Minute * 60).Unix(),
	}
	jwtToken := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tokenContent)
	token, err := jwtToken.SignedString([]byte(os.Getenv("JWT_PRIVATE_KEY")))
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func ParseToken(authHeader string) (jwt.MapClaims, error) {
	cleanJWT := strings.Replace(authHeader, "Bearer ", "", -1)
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(cleanJWT, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_PRIVATE_KEY")), nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, errors.New("Token is invalid")
	}
	return claims, nil
}

func TimeNow() *time.Time {
	now := time.Now().UTC()
	return &now
}

func SliceContains[K comparable](s []K, e K) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func GetConfig(ctx context.Context) config.AppConfig {
	return *ctx.Value("config").(*config.AppConfig)
}
