package handler

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/superhorsy/quest-app-frontend/backend/core/errors"
	"github.com/superhorsy/quest-app-frontend/backend/core/helpers"
	"github.com/superhorsy/quest-app-frontend/backend/core/logging"
	"github.com/superhorsy/quest-app-frontend/backend/middleware"
	"github.com/superhorsy/quest-app-frontend/backend/quests"
	"github.com/superhorsy/quest-app-frontend/backend/quests/model"
	"github.com/superhorsy/quest-app-frontend/backend/quests/store"
	"github.com/superhorsy/quest-app-frontend/backend/users"
	userStore "github.com/superhorsy/quest-app-frontend/backend/users/store"
	"go.uber.org/zap"
	"html"
	"net/http"
	"os"
	"strings"
)

func Actions(w http.ResponseWriter, r *http.Request) {
	middleware.AuthHandler(middleware.JsonResponse(http.HandlerFunc(actions))).ServeHTTP(w, r)
}

func actions(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	db, err := sqlx.Connect("postgres", os.Getenv("DSN"))
	if err != nil {
		logging.From(ctx).Error("failed to init db", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}
	defer db.Close()

	qs := store.New(db)
	qu := quests.New(qs)
	us := userStore.New(db)
	u := users.New(us)

	// Split the URL path by slashes
	pathSegments := strings.Split(r.URL.Path, "/")
	// The ID should be the last segment
	id := pathSegments[len(pathSegments)-2]

	userId := ctx.Value(middleware.ContextUserIdKey).(string)

	action := pathSegments[len(pathSegments)-1]

	switch action {
	case "next":
		answer, err := helpers.ParseBodyIntoStruct(r, model.Answer{})
		if err != nil {
			helpers.HandleError(ctx, w, err)
			return
		}

		ql, err := qu.CheckAnswer(ctx, id, &userId, answer)
		if err != nil {
			logging.From(ctx).Error("failed to check answer", zap.Error(err))
			helpers.HandleError(ctx, w, err)
			return
		}
		helpers.HandleResponse(ctx, w, ql)
	case "status":
		ql, err := qu.GetAssignment(ctx, id)
		if err != nil {
			logging.From(ctx).Error("failed to get status of quest", zap.Error(err))
			helpers.HandleError(ctx, w, err)
			return
		}

		helpers.HandleResponse(ctx, w, ql)
	case "start":
		ql, err := qu.StartQuest(ctx, id, &userId)
		if err != nil {
			logging.From(ctx).Error("failed to start quest", zap.Error(err))
			helpers.HandleError(ctx, w, err)
			return
		}

		helpers.HandleResponse(ctx, w, ql)
	case "send":
		sendRequest, err := helpers.ParseBodyIntoStruct(r, model.SendQuestRequest{})
		if err != nil {
			helpers.HandleError(ctx, w, err)
			return
		}
		sendRequest.QuestId = id

		quest, err := qu.GetQuest(ctx, id)
		if err != nil {
			logging.From(ctx).Error("failed to send quest", zap.Error(err))
			helpers.HandleError(ctx, w, err)
			return
		}

		// Check if quest has any steps
		if len(quest.Steps) == 0 {
			err = errors.ErrValidation.Wrap(errors.Error("can't send quest: no steps found inside a quest"))
			logging.From(ctx).Error(err.Error(), zap.Error(err))
			helpers.HandleError(ctx, w, err)
			return
		}
		// Check if quest is already send to that email

		// Save to DB
		if err := qu.CreateAssignment(ctx, *sendRequest); err != nil {
			logging.From(ctx).Error("failed to save send quest", zap.Error(err))
			helpers.HandleError(ctx, w, err)
			return
		}

		user, err := u.GetUser(ctx, userId)
		if err != nil {
			logging.From(ctx).Error("failed to find user", zap.Error(err))
			helpers.HandleError(ctx, w, err)
			return
		}

		mailingEnabled := os.Getenv("MAILING_ENABLED")
		if mailingEnabled == "true" {
			// Send email
			go func() {
				templateData := struct {
					Name string
					URL  string
					IMG  string
				}{
					Name: html.EscapeString(sendRequest.Name),
					URL:  "https://questy.fun",
					IMG:  "https://questy.fun/files/10d26a38-2fdf-4f48-adff-3e052e7466f5.png",
				}
				subject := fmt.Sprintf("Ваш друг %s отправил вам квест на Questy.fun!", user.FullName())
				err := helpers.SendEmail(sendRequest.Email, subject, "config/quest_invite.gohtml", templateData)
				if err != nil {
					logging.From(ctx).Error("failed to send email", zap.Error(err))
					return
				}
			}()
		}

		helpers.HandleResponse(ctx, w, struct {
			Success bool `json:"success"`
		}{Success: true})
	}
}
