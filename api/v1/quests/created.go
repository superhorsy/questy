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
	"go.uber.org/zap"
	"net/http"
	"strconv"
)

func Created(w http.ResponseWriter, r *http.Request) {
	middleware.AuthHandler(middleware.JsonResponse(http.HandlerFunc(questsCreated))).ServeHTTP(w, r)
}

func questsCreated(w http.ResponseWriter, r *http.Request) {
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

	limit := 50
	limitQueryParam := r.URL.Query().Get("limit")
	if limitQueryParam != "" {
		var err error
		limit, err = strconv.Atoi(limitQueryParam)
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
			helpers.HandleError(ctx, w, errors.ErrUnknown.Wrap(err))
			return
		}
	}

	userId := ctx.Value(middleware.ContextUserIdKey)
	questsByUser, meta, err := qu.GetQuestsByUser(ctx, userId.(string), offset, limit)
	if err != nil {
		logging.From(ctx).Error("failed to fetch questsByUser", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	helpers.HandleResponseWithMeta(ctx, w, questsByUser, meta)
}
