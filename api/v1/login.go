package handler

import (
	"context"
	"encoding/json"
	"github.com/superhorsy/quest-app-frontend/backend/config"
	"github.com/superhorsy/quest-app-frontend/backend/core/errors"
	"github.com/superhorsy/quest-app-frontend/backend/core/helpers"
	"github.com/superhorsy/quest-app-frontend/backend/core/logging"
	"github.com/superhorsy/quest-app-frontend/backend/middleware"
	"github.com/superhorsy/quest-app-frontend/backend/model"
	"github.com/superhorsy/quest-app-frontend/backend/users"
	"github.com/superhorsy/quest-app-frontend/backend/users/store"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"io"
	"net/http"
)

func Login(w http.ResponseWriter, r *http.Request) {
	middleware.JsonResponse(http.HandlerFunc(login)).ServeHTTP(w, r)
}

func login(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	cfg, err := config.Load(ctx)
	if err != nil {
		logging.From(ctx).Error("failed to load config", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}
	ctx = context.WithValue(ctx, "config", &cfg.AppConfig)

	// Connect to the DB
	db, err := helpers.InitDatabase(ctx, cfg)
	if err != nil {
		logging.From(ctx).Error("failed to init db", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	defer db.Close(ctx)

	us := store.New(db.GetDB())
	u := users.New(us)

	data, err := io.ReadAll(r.Body)
	if err != nil {
		helpers.HandleError(ctx, w, err)
		return
	}

	f := model.LoginForm{}

	if err := json.Unmarshal(data, &f); err != nil {
		logging.From(ctx).Error("failed to unmarshal json body", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	user, err := u.GetUserByEmail(ctx, f.Email)
	if err != nil {
		logging.From(ctx).Error("failed to login user", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(*user.Password), []byte(f.Password))
	if err == bcrypt.ErrMismatchedHashAndPassword && err != nil {
		err = errors.New("Wrong password")
		logging.From(ctx).Error("failed to login user", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}
	if err != nil {
		logging.From(ctx).Error("failed to login user", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	token, err := helpers.CreateJwtToken(*user.ID)
	if err != nil {
		logging.From(ctx).Error("failed to create token", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}
	helpers.HandleResponse(ctx, w, user, *token)
}
