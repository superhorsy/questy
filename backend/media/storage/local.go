package storage

import (
	"mime/multipart"
)

type Storage interface {
	Upload(file multipart.File, filename string) (string, error)
	GetLink(filename string) (string, error)
}
