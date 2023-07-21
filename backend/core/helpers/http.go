package helpers

import (
	"context"
	"encoding/json"
	"github.com/cenkalti/backoff/v4"
	"github.com/superhorsy/quest-app-frontend/backend/config"
	"github.com/superhorsy/quest-app-frontend/backend/core/errors"
	"github.com/superhorsy/quest-app-frontend/backend/core/logging"
	"github.com/superhorsy/quest-app-frontend/backend/drivers/psql"
	"go.uber.org/zap"
	"io"
	"net/http"
	"strings"
	"time"
)

func ParseBodyIntoStruct[K any](r *http.Request, target K) (*K, error) {
	ctx := r.Context()
	data, err := io.ReadAll(r.Body)
	if err != nil {
		logging.From(ctx).Error("failed to read request body", zap.Error(err))
		return nil, errors.ErrUnknown.Wrap(err)
	}

	if err := json.Unmarshal(data, &target); err != nil {
		logging.From(ctx).Error("failed to unmarshal json body", zap.Error(err))
		return nil, errors.ErrInvalidRequest.Wrap(err)
	}

	return &target, nil
}
func HandleResponse(ctx context.Context, w http.ResponseWriter, data interface{}, jwt ...string) {

	jsonRes := Response{
		Data: data,
	}

	if len(jwt) > 0 {
		jsonRes.Jwt = jwt[0]
	}

	dataBytes, err := json.Marshal(jsonRes)
	if err != nil {
		HandleError(ctx, w, err)
		return
	}

	if _, err := w.Write(dataBytes); err != nil {
		HandleError(ctx, w, err)
		return
	}
}

func HandleError(ctx context.Context, w http.ResponseWriter, err error) {
	logging.From(ctx).Error("error occurred in request", zap.Error(err))
	w.Header().Add("Content-Type", "application/json")

	switch {
	case errors.Is(err, errors.ErrInvalidRequest):
		fallthrough
	case errors.Is(err, errors.ErrValidation):
		w.WriteHeader(http.StatusBadRequest)
	case errors.Is(err, errors.ErrNotFound):
		w.WriteHeader(http.StatusNotFound)
	case errors.Is(err, errors.ErrForbidden):
		w.WriteHeader(http.StatusForbidden)
	case errors.Is(err, errors.ErrUnknown):
		fallthrough
	default:
		w.WriteHeader(http.StatusInternalServerError)
	}

	// TODO we may need to strip additional error information
	errorMessage := strings.Split(err.Error(), errors.ErrSeparator)[0]

	data, err := json.Marshal(ErrorMessage{
		Error: errorMessage,
	})
	if err != nil {
		logging.From(ctx).Error("failed to serialize error response", zap.Error(err))
		data = []byte(`{"error": "backend server error"}`)
	}

	_, err = w.Write(data)
	if err != nil {
		logging.From(ctx).Error("failed to write error response", zap.Error(err))
	}
}

func HandleResponseWithMeta(ctx context.Context, w http.ResponseWriter, data interface{}, meta interface{}) {

	jsonRes := Response{
		Data: data,
		Meta: meta,
	}

	dataBytes, err := json.Marshal(jsonRes)
	if err != nil {
		HandleError(ctx, w, err)
		return
	}

	if _, err := w.Write(dataBytes); err != nil {
		HandleError(ctx, w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

type ErrorMessage struct {
	Error string `json:"error"`
}

type Response struct {
	Data interface{} `json:"data"`
	Meta interface{} `json:"meta,omitempty"`
	Jwt  string      `json:"jwt,omitempty"`
}

func InitDatabase(ctx context.Context, cfg *config.Config) (*psql.Driver, error) {
	db := psql.New(cfg.PSQL)

	b := backoff.NewExponentialBackOff()
	b.MaxElapsedTime = 4 * time.Second
	err := backoff.Retry(func() error {
		err := db.Connect(ctx)
		if err != nil {
			logging.From(ctx).Error(err.Error())
		}
		return err
	}, b)
	if err != nil {
		return nil, err
	}

	return db, nil
}
