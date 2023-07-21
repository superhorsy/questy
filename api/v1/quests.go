package handler

import (
	"context"
	"encoding/json"
	"github.com/superhorsy/quest-app-frontend/backend/config"
	"github.com/superhorsy/quest-app-frontend/backend/core/errors"
	"github.com/superhorsy/quest-app-frontend/backend/core/helpers"
	"github.com/superhorsy/quest-app-frontend/backend/core/logging"
	"github.com/superhorsy/quest-app-frontend/backend/middleware"
	"github.com/superhorsy/quest-app-frontend/backend/quests"
	"github.com/superhorsy/quest-app-frontend/backend/quests/model"
	"github.com/superhorsy/quest-app-frontend/backend/quests/store"
	"go.uber.org/zap"
	"io"
	"net/http"
)

func Quests(w http.ResponseWriter, r *http.Request) {
	middleware.AuthHandler(middleware.JsonResponse(http.HandlerFunc(questsH))).ServeHTTP(w, r)
}

func questsH(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
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

	data, err := io.ReadAll(r.Body)
	if err != nil {
		helpers.HandleError(ctx, w, err)
		return
	}

	q := model.QuestWithSteps{}

	if err := json.Unmarshal(data, &q); err != nil {
		logging.From(ctx).Error("failed to unmarshal json body", zap.Error(err))
		helpers.HandleError(ctx, w, errors.ErrInvalidRequest.Wrap(err))
		return
	}

	id := ctx.Value(middleware.ContextUserIdKey).(string)
	q.Owner = &id

	createdQuest, err := qu.CreateQuest(ctx, &q)
	if err != nil {
		logging.From(ctx).Error("failed to create quest", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	helpers.HandleResponse(ctx, w, createdQuest)
}
