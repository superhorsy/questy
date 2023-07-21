package media

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/superhorsy/quest-app-frontend/backend/core/errors"
	"github.com/superhorsy/quest-app-frontend/backend/core/helpers"
	"github.com/superhorsy/quest-app-frontend/backend/core/logging"
	"github.com/superhorsy/quest-app-frontend/backend/media"
	"github.com/superhorsy/quest-app-frontend/backend/media/model"
	"github.com/superhorsy/quest-app-frontend/backend/media/storage"
	"github.com/superhorsy/quest-app-frontend/backend/media/store"
	"github.com/superhorsy/quest-app-frontend/backend/middleware"
	"go.uber.org/zap"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

func Upload(w http.ResponseWriter, r *http.Request) {
	middleware.AuthHandler(middleware.JsonResponse(http.HandlerFunc(upload))).ServeHTTP(w, r)
}

func upload(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	db, err := sqlx.Connect("postgres", os.Getenv("DSN"))
	if err != nil {
		logging.From(ctx).Error("failed to init db", zap.Error(err))
		helpers.HandleError(ctx, w, err)
		return
	}
	defer db.Close()

	s := storage.NewS3Storage()
	// Storage for static content
	m := media.New(store.New(db), s)

	fmt.Println("File Upload Endpoint Hit")

	// Parse our multipart form, 5 << 20 specifies a maximum
	// upload of 5 MB files.
	// left shift 5 << 20 which results in 5*2^20
	// x << y, results in x*2^y
	err = r.ParseMultipartForm(5 << 20)
	if err != nil {
		logging.From(ctx).Error("failed to upload file: file exceeds 5Mb", zap.Error(err))
		helpers.HandleError(ctx, w, errors.ErrInvalidRequest.Wrap(err))
		return
	}

	t := model.MediaType(r.Form.Get("type"))

	// FormFile returns the first file for the given key `myFile`
	// it also returns the FileHeader, so we can get the Filename,
	// the Header and the size of the file
	file, header, err := r.FormFile("file")
	if err != nil {
		logging.From(ctx).Error("Error Retrieving the File", zap.Error(err))
		helpers.HandleError(ctx, w, errors.ErrInvalidRequest.Wrap(err))
		return
	}
	defer func(file multipart.File) {
		_ = file.Close()
	}(file)

	if err = validate(*header, t); err != nil {
		logging.From(ctx).Error(err.Error(), zap.Error(err))
		helpers.HandleError(ctx, w, errors.ErrInvalidRequest.Wrap(err))
		return
	}

	mediaRecord, err := m.UploadFile(ctx, file, header.Filename, t)
	if err != nil {
		logging.From(ctx).Error("failed to upload file to storage", zap.Error(err))
		helpers.HandleError(ctx, w, errors.ErrInvalidRequest.Wrap(err))
		return
	}
	helpers.HandleResponse(ctx, w, mediaRecord)
}

func validate(header multipart.FileHeader, mediaType model.MediaType) error {
	if !(mediaType == model.Sound || mediaType == model.Image) {
		return errors.New("bad file type")
	}

	imagesExt := []string{
		".png",
		".jpg",
		".jpeg",
	}
	soundExt := []string{
		".mp3",
		".wav,",
		".webm",
	}

	fmt.Printf("Uploaded File: %+v", header.Filename)
	fmt.Printf("File Size: %+v\n", header.Size)
	fmt.Printf("MIME Header: %+v\n", header.Header)

	ext := filepath.Ext(header.Filename)

	if !(helpers.SliceContains(imagesExt, ext) || helpers.SliceContains(soundExt, ext)) {
		return errors.New(fmt.Sprintf("bad file type: %s", ext))
	}

	if helpers.SliceContains(imagesExt, ext) && mediaType != model.Image {
		return errors.New(fmt.Sprintf("bad file type for type 'image': %s", ext))
	}

	if helpers.SliceContains(soundExt, ext) && mediaType != model.Sound {
		return errors.New(fmt.Sprintf("bad file type for type 'sound': %s", ext))
	}
	return nil
}
