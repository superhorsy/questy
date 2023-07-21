package config

import (
	"context"
	"github.com/caarlos0/env/v6"
	"github.com/go-playground/validator/v10"
	"github.com/superhorsy/quest-app-frontend/backend/core/config"
	"github.com/superhorsy/quest-app-frontend/backend/core/errors"
)

const (
	// ErrValidation is returned when the configuration is invalid.
	ErrValidation = errors.Error("invalid configuration")
	// ErrEnvVars is returned when the environment variables are invalid.
	ErrEnvVars = errors.Error("failed parsing env vars")
)

// Config represents the configuration of our application.
type Config struct {
	config.AppConfig `yaml:",inline"`
}

// Load loads the configuration from the config/config.yaml file.
func Load(ctx context.Context) (*Config, error) {
	cfg := &Config{}

	// Then fill struct with environment values
	if err := env.Parse(cfg); err != nil {
		return nil, ErrEnvVars.Wrap(err)
	}

	validate := validator.New()
	if err := validate.Struct(cfg); err != nil {
		return nil, ErrValidation.Wrap(err)
	}

	return cfg, nil
}
