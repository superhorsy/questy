package media

import (
	"context"
	"github.com/superhorsy/quest-app-frontend/backend/media/model"
	"github.com/superhorsy/quest-app-frontend/backend/media/storage"
	"github.com/superhorsy/quest-app-frontend/backend/media/store"
	"mime/multipart"
)

type Media struct {
	recordStore store.RecordStore
	storage     storage.Storage
}

func New(rs *store.RecordStore, fs storage.Storage) *Media {
	return &Media{
		recordStore: *rs,
		storage:     fs,
	}
}

func (m Media) UploadFile(ctx context.Context, file multipart.File, filename string, mediaType model.MediaType) (*model.MediaRecord, error) {
	record := &model.MediaRecord{
		Storage:  "s3",
		Type:     mediaType,
		Filename: filename,
	}

	link, err := m.storage.Upload(file, filename)
	if err != nil {
		return nil, err
	}

	record.Link = link

	record, err = m.recordStore.InsertMedia(ctx, record)
	if err != nil {
		return nil, err
	}

	return record, nil
}

func (m Media) GetMedia(ctx context.Context, id string) (*model.MediaRecord, error) {
	media, err := m.recordStore.GetMedia(ctx, id)
	if err != nil {
		return nil, err
	}
	media.Link, err = m.storage.GetLink(media.Filename)
	if err != nil {
		return nil, err
	}
	return media, nil
}
