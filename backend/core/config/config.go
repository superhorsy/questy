package config

import (
	"github.com/superhorsy/quest-app-frontend/backend/core/errors"
	"github.com/superhorsy/quest-app-frontend/backend/drivers/psql"
)

var config *AppConfig = nil

// Config represents the configuration of the http listener.
type Config struct {
	Port string `yaml:"port"`
}

// AppConfig represents the configuration of our application.
type AppConfig struct {
	HTTP           Config      `yaml:"http"`
	PSQL           psql.Config `yaml:"psql"`
	PurgeOnRestart bool        `yaml:"purge_on_restart"`
	JwtPrivateKey  string      `env:"JWT_PRIVATE_KEY" validate:"required"`
	SentryDSN      string      `env:"SENTRY_DSN"`
}

func (*AppConfig) Set(appConfig AppConfig) {
	config = &appConfig
}
func (*AppConfig) Get() (*AppConfig, error) {
	if config != nil {
		return nil, errors.New("No config found")
	}
	return config, nil
}

type ContextKey string
