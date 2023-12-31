package handler

import (
	"encoding/json"
	"github.com/jmoiron/sqlx"
	"github.com/superhorsy/quest-app-frontend/backend/core/errors"
	"github.com/superhorsy/quest-app-frontend/backend/core/helpers"
	"github.com/superhorsy/quest-app-frontend/backend/core/logging"
	"github.com/superhorsy/quest-app-frontend/backend/middleware"
	"github.com/superhorsy/quest-app-frontend/backend/model"
	"github.com/superhorsy/quest-app-frontend/backend/users"
	"github.com/superhorsy/quest-app-frontend/backend/users/store"
	"go.uber.org/zap"
	"io"
	"net/http"
	"os"
)

func Register(w http.ResponseWriter, r *http.Request) {
	middleware.JsonResponse(http.HandlerFunc(register)).ServeHTTP(w, r)
}

func register(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	db, err := sqlx.Connect("postgres", os.Getenv("DSN"))
	if err != nil {
		logging.From(ctx).Error("failed to init db", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}
	defer db.Close()

	us := store.New(db)
	u := users.New(us)

	data, err := io.ReadAll(r.Body)
	if err != nil {
		helpers.HandleError(ctx, w, err)
		return
	}

	f := model.RegistrationRequest{}

	if err := json.Unmarshal(data, &f); err != nil {
		logging.From(ctx).Error("failed to unmarshal json body", zap.Error(err))
		helpers.HandleError(ctx, w, errors.ErrInvalidRequest.Wrap(err))
		return
	}

	err = model.Validate(
		[]model.Validation{
			//{Value: f.Name, Valid: "username", Error: errors.New("Username can contain only numbers and english letters")},
			{Value: f.Email, Valid: "email", Error: errors.New("Invalid email")},
			//{Value: f.Password, Valid: "password", Error: errors.New("Password should be at least 5 letters long")},
		})
	if err != nil {
		logging.From(ctx).Error("validation failed", zap.Error(err))
		helpers.HandleError(ctx, w, errors.ErrInvalidRequest.Wrap(err))
		return
	}

	up := model.UserWithPass{}

	if err := json.Unmarshal(data, &up); err != nil {
		logging.From(ctx).Error("failed to unmarshal json body", zap.Error(err))
		helpers.HandleError(ctx, w, errors.ErrInvalidRequest.Wrap(err))
		return
	}

	createdUser, err := u.CreateUser(ctx, &up)
	if err != nil {
		logging.From(ctx).Error("failed to create user", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	token, err := helpers.CreateJwtToken(*createdUser.ID)
	if err != nil {
		logging.From(ctx).Error("failed to create token", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	helpers.HandleResponse(ctx, w, createdUser, *token)
}
