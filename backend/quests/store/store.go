package store

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/superhorsy/quest-app-frontend/backend/core/errors"
	"github.com/superhorsy/quest-app-frontend/backend/core/logging"
	"github.com/superhorsy/quest-app-frontend/backend/middleware"
	"github.com/superhorsy/quest-app-frontend/backend/quests/model"
	"strings"
	"time"

	"go.uber.org/zap"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

const (
	// ErrInvalidEmail is returned when the email is not a valid address or is empty.
	ErrInvalidEmail = errors.Error("invalid_email: email is invalid")
	// ErrQuestAlreadySentToEmail is returned when the email address is already used via another user.
	ErrQuestAlreadySentToEmail = errors.Error("Quest is already sent to this email")
	// ErrEmptyNickname is returned when the nickname is empty.
	ErrEmptyNickname = errors.Error("empty_nickname: nickname is empty")
	// ErrNicknameAlreadyUsed is returned when the nickname is already used via another user.
	ErrNicknameAlreadyUsed = errors.Error("nickname_already_used: nickname is already in use")
	// ErrEmptyPassword is returned when the password is empty.
	ErrEmptyPassword = errors.Error("empty_password: password is empty")
	// ErrInvalidID si returned when the ID is not a valid UUID or is empty.
	ErrInvalidID        = errors.Error("invalid_id: id is invalid")
	ErrQuestAlreadySent = errors.Error("Нельзя удалить квест, отправленый другу!")
	ErrQuestNotDeleted  = errors.Error("quest not deleted")
)

const (
	pqErrInvalidTextRepresentation = "invalid_text_representation"
)

var timeNow = func() *time.Time {
	now := time.Now().UTC()
	return &now
}

// DB represents a type for interfacing with database.
type DB interface {
	NamedQueryContext(ctx context.Context, query string, arg interface{}) (*sqlx.Rows, error)
	GetContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error
	SelectContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error
	NamedExecContext(ctx context.Context, query string, arg interface{}) (sql.Result, error)
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	QueryxContext(ctx context.Context, query string, args ...interface{}) (*sqlx.Rows, error)
}

// Store provides functionality for working with a database.
type Store struct {
	db DB
}

// New will instantiate a new instance of Store.
func New(db DB) *Store {
	return &Store{
		db: db,
	}
}

// InsertQuest will add a new quest to the database using the provided data.
func (s *Store) InsertQuest(ctx context.Context, quest *model.QuestWithSteps) (*model.QuestWithSteps, error) {
	createdQuest, err := s.saveQuest(ctx, quest)
	if err != nil {
		return nil, err
	}

	if len(quest.Steps) != 0 {
		createdQuest, err = s.updateSteps(ctx, createdQuest, quest.Steps)
		if err != nil {
			return nil, err
		}
	} else {
		quest.Steps = []model.Step{}
	}

	return createdQuest, nil
}

// GetQuest fetches quest by id
func (s *Store) GetQuest(ctx context.Context, id string) (*model.QuestWithSteps, error) {
	var q model.QuestWithSteps

	if err := s.db.GetContext(ctx, &q, "SELECT * FROM quests WHERE id = $1", id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.ErrNotFound.Wrap(err)
		}
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			if pqErr.Code.Name() == pqErrInvalidTextRepresentation && strings.Contains(pqErr.Error(), "uuid") {
				return nil, ErrInvalidID.Wrap(errors.ErrValidation.Wrap(err))
			}
		}

		return nil, errors.ErrUnknown.Wrap(err)
	}

	res, err := s.db.QueryxContext(ctx, `SELECT * FROM steps WHERE quest_id = $1`, id)

	if err = checkWriteError(err); err != nil {
		return nil, err
	}

	q.Steps = []model.Step{}
	var step model.Step
	for res.Next() {
		if err := res.StructScan(&step); err != nil {
			return nil, errors.ErrUnknown.Wrap(err)
		}
		q.Steps = append(q.Steps, step)
	}

	defer res.Close()

	r, err := s.GetRecipients(ctx, *q.Owner, *q.ID)
	if err != nil {
		return nil, err
	}
	q.Recipients = r

	return &q, nil
}

func (s *Store) GetRecipients(ctx context.Context, ownerId string, questId string) ([]model.Recipient, error) {

	r := []model.Recipient{}
	query := `SELECT qe.quest_id, qe.email, qe.name, qe.status, qe.current_step FROM quest_to_email qe JOIN quests q ON q.id = qe.quest_id
         WHERE q.owner = $1 AND q.id = $2`
	err := s.db.SelectContext(ctx, &r, query, ownerId, questId)
	if err = checkWriteError(err); err != nil {
		return nil, err
	}
	return r, nil
}

// GetQuestsByUser will get quests created by user
func (s *Store) GetQuestsByUser(ctx context.Context, uuid string, offset int, limit int) ([]model.Quest, *model.Meta, error) {
	rows, err := s.db.QueryxContext(ctx, "SELECT * FROM quests WHERE owner=$1 ORDER BY created_at ASC LIMIT $2 OFFSET $3", uuid, limit, offset)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil, errors.ErrNotFound.Wrap(err)
		}

		return nil, nil, errors.ErrUnknown.Wrap(err)
	}
	defer rows.Close()

	var quests []model.Quest

	for rows.Next() {
		var quest model.Quest
		if err := rows.StructScan(&quest); err != nil {
			logging.From(ctx).Error("failed to deserialize quest from database", zap.Error(err))
		} else {
			quests = append(quests, quest)
		}
	}

	res, err := s.db.QueryxContext(ctx, `SELECT qe.quest_id, qe.email, qe.name, qe.status, qe.current_step FROM quest_to_email qe JOIN quests q ON q.id = qe.quest_id
         WHERE q.owner = $1`, uuid)

	if err = checkWriteError(err); err != nil {
		return nil, nil, err
	}

	for res.Next() {
		recipient := &model.Recipient{}
		if err := res.StructScan(&recipient); err != nil {
			return nil, nil, errors.ErrUnknown.Wrap(err)
		}
		for i := range quests {
			if *quests[i].ID == recipient.QuestId {
				quests[i].Recipients = append(quests[i].Recipients, *recipient)
				break
			}
		}
	}

	defer res.Close()

	const countQuery = `SELECT count(*) as total_count FROM quests q WHERE owner=$1`

	var meta model.Meta

	err = s.db.GetContext(ctx, &meta, countQuery, uuid)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil, errors.ErrNotFound.Wrap(err)
		}

		return nil, nil, errors.ErrUnknown.Wrap(err)
	}

	return quests, &meta, nil
}

func (s *Store) UpdateQuest(ctx context.Context, quest *model.QuestWithSteps) (*model.QuestWithSteps, error) {
	quest.UpdatedAt = timeNow()

	res, err := s.db.NamedQueryContext(ctx, `UPDATE quests SET "name" = :name, description = :description, 
                  theme = :theme, final_message = :final_message, rewards = :rewards, updated_at = :updated_at 
			WHERE id = :id RETURNING *`, quest)
	if err = checkWriteError(err); err != nil {
		return nil, err
	}
	if !res.Next() {
		return nil, errors.ErrNotFound
	}
	defer res.Close()

	updatedQuest := &model.QuestWithSteps{}

	if err := res.StructScan(&updatedQuest); err != nil {
		return nil, errors.ErrUnknown.Wrap(err)
	}

	// Delete saved steps
	_, err = s.db.ExecContext(ctx, "DELETE FROM steps WHERE quest_id = $1", updatedQuest.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.ErrNotFound.Wrap(err)
		}
		return nil, errors.ErrUnknown.Wrap(err)
	}

	// Update steps if there are any
	if len(quest.Steps) == 0 {
		return updatedQuest, nil
	}

	// Remove IDs from steps if there were any
	for i, step := range quest.Steps {
		emptyId := ""
		if step.ID != &emptyId {
			quest.Steps[i].ID = &emptyId
		}
	}

	updatedQuest, err = s.updateSteps(ctx, updatedQuest, quest.Steps)
	if err = checkWriteError(err); err != nil {
		return nil, err
	}

	return updatedQuest, nil
}

func (s *Store) CreateAssignment(ctx context.Context, request model.SendQuestRequest) error {
	res, err := s.db.NamedQueryContext(ctx, `INSERT INTO quest_to_email(quest_id, email, name) VALUES (:quest_id, :email, :name)`, request)
	if err = checkWriteError(err); err != nil {
		return err
	}
	defer res.Close()
	return nil
}

func (s *Store) GetAssignment(ctx context.Context, questId string, userId string) (*model.Assignment, error) {
	var a model.Assignment

	if err := s.db.GetContext(ctx, &a, "SELECT qe.* FROM quest_to_email qe JOIN users u ON u.email = qe.email WHERE qe.quest_id = $1 AND u.id = $2", questId, userId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.ErrNotFound.Wrap(err)
		}
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			if pqErr.Code.Name() == pqErrInvalidTextRepresentation && strings.Contains(pqErr.Error(), "uuid") {
				return nil, ErrInvalidID.Wrap(errors.ErrValidation.Wrap(err))
			}
		}

		return nil, errors.ErrUnknown.Wrap(err)
	}
	return &a, nil
}

func (s *Store) UpdateAssignment(ctx context.Context, questId string, userId *string, currentStep int, status model.Status) error {
	res, err := s.db.QueryxContext(ctx,
		`UPDATE quest_to_email
				SET "status" = $1,
				    "current_step" = $2
				WHERE email = (select email from users where id = $4)
				AND quest_id = $3`, status, currentStep, questId, userId)
	defer res.Close()
	return checkWriteError(err)
}

func (s *Store) DeleteQuest(ctx context.Context, id string) error {
	userId := ctx.Value(middleware.ContextUserIdKey).(string)
	res, err := s.db.ExecContext(ctx, "DELETE FROM quests WHERE id = $1 AND owner = $2", id, userId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			if pqErr.Code.Name() == pqErrInvalidTextRepresentation && strings.Contains(pqErr.Error(), "uuid") {
				return ErrInvalidID.Wrap(errors.ErrValidation.Wrap(err))
			}
			if strings.Contains(pqErr.Error(), "quest_to_email") {
				return ErrQuestAlreadySent.Wrap(errors.ErrValidation.Wrap(err))
			}
		}

		return errors.ErrUnknown.Wrap(err)
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return errors.ErrUnknown.Wrap(err)
	}
	if rows != 1 {
		return ErrQuestNotDeleted.Wrap(errors.ErrNotFound)
	}

	return nil
}

func (s *Store) GetQuestsAvailable(ctx context.Context, email string, offset int, limit int, finished bool) ([]model.QuestAvailable, *model.Meta, error) {
	statusWhere := fmt.Sprintf("qe.status IN ('%s','%s')", model.StatusNotStarted, model.StatusInProgress)
	if finished {
		statusWhere = fmt.Sprintf("qe.status = '%s'", model.StatusFinished)
	}
	query := fmt.Sprintf(`SELECT qe.quest_id,
       q.name as quest_name,
       q.description as quest_description,
       q.theme as quest_theme,
       qe.status,
       qe.current_step as steps_current,
       CASE when s.steps_count is NULL THEN 0 ELSE s.steps_count END AS steps_count,
       u.id                                   as "owner.id",
       concat(u.first_name, ' ', u.last_name) as "owner.name"
FROM quests q
         JOIN quest_to_email qe ON qe.quest_id = q.id
         JOIN users u ON q.owner = u.id
         FULL OUTER JOIN (SELECT DISTINCT steps.quest_id, COUNT(*) AS steps_count
                           FROM steps GROUP BY steps.quest_id) as s ON qe.quest_id = s.quest_id
WHERE qe.email = $1 AND %s
ORDER BY q.created_at ASC
OFFSET $2 LIMIT $3`, statusWhere)

	var quests []model.QuestAvailable
	err := s.db.SelectContext(ctx, &quests, query, email, offset, limit)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil, errors.ErrNotFound.Wrap(err)
		}

		return nil, nil, errors.ErrUnknown.Wrap(err)
	}

	const countQuery = `SELECT count(*) as total_count
		FROM quests q
    	JOIN quest_to_email qe ON qe.quest_id = q.id
    	JOIN users u ON q.owner = u.id
		WHERE qe.email = $1 AND %s`

	var meta model.Meta

	err = s.db.GetContext(ctx, &meta, fmt.Sprintf(countQuery, statusWhere), email)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil, errors.ErrNotFound.Wrap(err)
		}

		return nil, nil, errors.ErrUnknown.Wrap(err)
	}

	return quests, &meta, nil
}

// Private methods

func (s *Store) updateSteps(ctx context.Context, quest *model.QuestWithSteps, steps []model.Step) (*model.QuestWithSteps, error) {
	for i := range steps {
		steps[i].QuestId = quest.ID
		steps[i].CreatedAt = quest.UpdatedAt
		steps[i].UpdatedAt = quest.UpdatedAt
	}

	res, err := s.db.NamedQueryContext(ctx, `INSERT INTO
			steps(quest_id, sort,description,question_type,question_content,answer_type,answer_content,created_at,updated_at)
			VALUES (:quest_id, :sort,:description,:question_type,:question_content,:answer_type,:answer_content,:created_at,:updated_at)
			RETURNING *`, steps)

	if err = checkWriteError(err); err != nil {
		return nil, err
	}

	quest.Steps = []model.Step{}
	var step model.Step
	for res.Next() {
		if err := res.StructScan(&step); err != nil {
			return nil, errors.ErrUnknown.Wrap(err)
		}
		quest.Steps = append(quest.Steps, step)
	}

	defer res.Close()
	return quest, nil
}

func (s *Store) saveQuest(ctx context.Context, quest *model.QuestWithSteps) (*model.QuestWithSteps, error) {
	quest.CreatedAt = timeNow()
	quest.UpdatedAt = quest.CreatedAt

	res, err := s.db.NamedQueryContext(ctx,
		`INSERT INTO 
		quests("name",description,"owner",theme,final_message, rewards,created_at,updated_at) 
		VALUES (:name,:description,:owner,:theme,:final_message, :rewards, :created_at, :updated_at) 
		RETURNING *`, quest)
	if err = checkWriteError(err); err != nil {
		return nil, err
	}
	defer res.Close()

	if !res.Next() {
		return nil, errors.ErrUnknown
	}

	createdQuest := &model.QuestWithSteps{}

	if err := res.StructScan(&createdQuest); err != nil {
		return nil, errors.ErrUnknown.Wrap(err)
	}
	return createdQuest, nil
}

//nolint:cyclop
func checkWriteError(err error) error {
	if err == nil {
		return nil
	}

	var pqErr *pq.Error
	if errors.As(err, &pqErr) {
		switch pqErr.Code.Name() {
		case "string_data_right_truncation":
			return errors.ErrValidation.Wrap(err)
		case "check_violation":
			switch {
			case strings.Contains(pqErr.Error(), "email_check"):
				return ErrInvalidEmail.Wrap(errors.ErrValidation.Wrap(err))
			case strings.Contains(pqErr.Error(), "users_nickname_check"):
				return ErrEmptyNickname.Wrap(errors.ErrValidation.Wrap(err))
			case strings.Contains(pqErr.Error(), "users_password_check"):
				return ErrEmptyPassword.Wrap(errors.ErrValidation.Wrap(err))
			default:
				return errors.ErrValidation.Wrap(err)
			}
		case "not_null_violation":
			switch {
			case strings.Contains(pqErr.Error(), "email"):
				return ErrInvalidEmail.Wrap(errors.ErrValidation.Wrap(err))
			case strings.Contains(pqErr.Error(), "nickname"):
				return ErrEmptyNickname.Wrap(errors.ErrValidation.Wrap(err))
			case strings.Contains(pqErr.Error(), "password"):
				return ErrEmptyPassword.Wrap(errors.ErrValidation.Wrap(err))
			default:
				return errors.ErrValidation.Wrap(err)
			}
		case "unique_violation":
			if strings.Contains(pqErr.Error(), "quest_id_email_unique") {
				return ErrQuestAlreadySentToEmail.Wrap(errors.ErrValidation.Wrap(err))
			} else if strings.Contains(pqErr.Error(), "nickname_unique") {
				return ErrNicknameAlreadyUsed.Wrap(errors.ErrValidation.Wrap(err))
			}
			return errors.ErrValidation.Wrap(err)
		case "invalid_text_representation":
			if strings.Contains(pqErr.Error(), "uuid") {
				return ErrInvalidID.Wrap(errors.ErrValidation.Wrap(err))
			}
		}
	}

	return errors.ErrUnknown.Wrap(err)
}
