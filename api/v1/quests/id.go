package handler

import (
	"context"
	"github.com/superhorsy/quest-app-frontend/backend/config"
	"github.com/superhorsy/quest-app-frontend/backend/core/helpers"
	"github.com/superhorsy/quest-app-frontend/backend/core/logging"
	"github.com/superhorsy/quest-app-frontend/backend/middleware"
	"github.com/superhorsy/quest-app-frontend/backend/quests"
	"github.com/superhorsy/quest-app-frontend/backend/quests/model"
	"github.com/superhorsy/quest-app-frontend/backend/quests/store"
	"go.uber.org/zap"
	"net/http"
	"strings"
)

func Id(w http.ResponseWriter, r *http.Request) {
	middleware.AuthHandler(middleware.JsonResponse(http.HandlerFunc(idHandler))).ServeHTTP(w, r)
}

func idHandler(w http.ResponseWriter, r *http.Request) {

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

	// Split the URL path by slashes
	pathSegments := strings.Split(r.URL.Path, "/")
	// The ID should be the last segment
	id := pathSegments[len(pathSegments)-1]

	if r.Method == http.MethodGet {
		quest, err := qu.GetQuest(ctx, id)
		if err != nil {
			logging.From(ctx).Error("failed to fetch quest", zap.Error(err))
			helpers.HandleError(ctx, w, err)
			return
		}

		helpers.HandleResponse(ctx, w, quest)
	}

	if r.Method == http.MethodPut {
		q, err := helpers.ParseBodyIntoStruct(r, model.QuestWithSteps{})
		if err != nil {
			helpers.HandleError(ctx, w, err)
			return
		}
		q.ID = &id

		updatedQuest, err := qu.UpdateQuest(ctx, q)
		if err != nil {
			logging.From(ctx).Error("failed to update quest", zap.Error(err))
			helpers.HandleError(ctx, w, err)
			return
		}

		helpers.HandleResponse(ctx, w, updatedQuest)
	}

	if r.Method == http.MethodDelete {
		err := qu.DeleteQuest(ctx, id)
		if err != nil {
			logging.From(ctx).Error("failed to delete quest", zap.Error(err))
			helpers.HandleError(ctx, w, err)
			return
		}

		helpers.HandleResponse(ctx, w, struct {
			Success bool `json:"success"`
		}{Success: true})

	}
}
