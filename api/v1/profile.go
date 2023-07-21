package handler

import (
	"context"
	"github.com/superhorsy/quest-app-frontend/backend/config"
	"github.com/superhorsy/quest-app-frontend/backend/core/helpers"
	"github.com/superhorsy/quest-app-frontend/backend/core/logging"
	"github.com/superhorsy/quest-app-frontend/backend/middleware"
	"github.com/superhorsy/quest-app-frontend/backend/model"
	"github.com/superhorsy/quest-app-frontend/backend/users"
	"github.com/superhorsy/quest-app-frontend/backend/users/store"
	"go.uber.org/zap"
	"net/http"
)

func Profile(w http.ResponseWriter, r *http.Request) {
	middleware.AuthHandler(middleware.JsonResponse(http.HandlerFunc(profile))).ServeHTTP(w, r)
}

func profile(w http.ResponseWriter, r *http.Request) {
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

	userId := ctx.Value(middleware.ContextUserIdKey).(string)

	user, err := u.GetUser(ctx, userId)
	if err != nil {
		logging.From(ctx).Error("failed to get user", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	if r.Method == http.MethodPut {
		req, err := helpers.ParseBodyIntoStruct(r, model.UserWithPass{})
		if err != nil {
			helpers.HandleError(ctx, w, err)
			return
		}
		req.ID = &userId
		// Email can not be changed on profile update
		req.Email = user.Email

		user, err = u.UpdateUser(ctx, req)
		if err != nil {
			logging.From(ctx).Error("failed to update user", zap.Error(err))
			helpers.HandleError(ctx, w, err)
			return
		}

	}
	helpers.HandleResponse(ctx, w, user)
}
