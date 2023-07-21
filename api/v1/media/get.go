package media

import (
	"github.com/jmoiron/sqlx"
	"github.com/superhorsy/quest-app-frontend/backend/core/helpers"
	"github.com/superhorsy/quest-app-frontend/backend/core/logging"
	"github.com/superhorsy/quest-app-frontend/backend/media"
	"github.com/superhorsy/quest-app-frontend/backend/media/storage"
	"github.com/superhorsy/quest-app-frontend/backend/media/store"
	"github.com/superhorsy/quest-app-frontend/backend/middleware"
	"go.uber.org/zap"
	"net/http"
	"os"
	"strings"
)

func Media(w http.ResponseWriter, r *http.Request) {
	middleware.AuthHandler(middleware.JsonResponse(http.HandlerFunc(mediaH))).ServeHTTP(w, r)
}

func mediaH(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	db, err := sqlx.Connect("postgres", os.Getenv("DSN"))
	if err != nil {
		logging.From(ctx).Error("failed to init db", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}
	defer db.Close()

	// Split the URL path by slashes
	pathSegments := strings.Split(r.URL.Path, "/")
	// The ID should be the last segment
	id := pathSegments[len(pathSegments)-1]

	s := storage.NewS3Storage()
	// Storage for static content
	m := media.New(store.New(db), s)

	med, err := m.GetMedia(ctx, id)
	if err != nil {
		logging.From(ctx).Error("failed to fetch media", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	med.Link, err = s.GetLink(med.Filename)
	if err != nil {
		logging.From(ctx).Error("failed to fetch media", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}

	helpers.HandleResponse(ctx, w, med)
}
