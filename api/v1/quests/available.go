package handler

import (
	"context"
	"github.com/superhorsy/quest-app-frontend/backend/config"
	"github.com/superhorsy/quest-app-frontend/backend/core/errors"
	"github.com/superhorsy/quest-app-frontend/backend/core/helpers"
	"github.com/superhorsy/quest-app-frontend/backend/core/logging"
	"github.com/superhorsy/quest-app-frontend/backend/middleware"
	"github.com/superhorsy/quest-app-frontend/backend/quests"
	"github.com/superhorsy/quest-app-frontend/backend/quests/store"
	"github.com/superhorsy/quest-app-frontend/backend/users"
	userStore "github.com/superhorsy/quest-app-frontend/backend/users/store"
	"go.uber.org/zap"
	"net/http"
	"strconv"
)

func Available(w http.ResponseWriter, r *http.Request) {
	middleware.AuthHandler(middleware.JsonResponse(http.HandlerFunc(available))).ServeHTTP(w, r)
}

func available(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(404)
		return
	}

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

	qs := store.New(db.GetDB())
	qu := quests.New(qs)
	us := userStore.New(db.GetDB())
	u := users.New(us)

	limit := 50
	limitQueryParam := r.URL.Query().Get("limit")
	if limitQueryParam != "" {
		var err error
		queryLimit, err := strconv.Atoi(limitQueryParam)
		if queryLimit < 1000 {
			limit = queryLimit
		}
		if err != nil {
			logging.From(ctx).Error("failed to read request body", zap.Error(err))
			helpers.HandleError(ctx, w, errors.ErrUnknown.Wrap(err))
			return
		}
	}

	offset := 0
	offsetQueryParam := r.URL.Query().Get("offset")
	if offsetQueryParam != "" {
		var err error
		offset, err = strconv.Atoi(offsetQueryParam)
		if err != nil {
			logging.From(ctx).Error("failed to read request body", zap.Error(err))
			helpers.HandleError(ctx, w, errors.ErrInvalidRequest.Wrap(err))
			return
		}
	}

	finished := false
	finishedQueryParam := r.URL.Query().Get("finished")
	if finishedQueryParam != "" {
		var err error
		finished, err = strconv.ParseBool(finishedQueryParam)
		if err != nil {
			logging.From(ctx).Error("failed to read request body", zap.Error(err))
			helpers.HandleError(ctx, w, errors.ErrInvalidRequest.Wrap(err))
			return
		}
	}

	userId := ctx.Value(middleware.ContextUserIdKey)
	user, err := u.GetUser(ctx, userId.(string))
	if err != nil {
		logging.From(ctx).Error("failed to find user", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}
	questsAvail, meta, err := qu.GetQuestsAvailable(ctx, *user.Email, offset, limit, finished)
	if err != nil {
		logging.From(ctx).Error("failed to fetch quests", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	helpers.HandleResponseWithMeta(ctx, w, questsAvail, meta)
}
