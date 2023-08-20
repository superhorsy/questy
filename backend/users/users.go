package users

import (
	"context"
	"github.com/superhorsy/quest-app-frontend/backend/core/helpers"
	"github.com/superhorsy/quest-app-frontend/backend/model"
)

// Store represents a type for storing a user in a database.
type Store interface {
	InsertUser(ctx context.Context, user *model.UserWithPass) (*model.User, error)
	UpdateUser(ctx context.Context, user *model.UserWithPass) (*model.User, error)
	GetUser(ctx context.Context, id string) (*model.User, error)
	GetUserByEmail(ctx context.Context, email string) (*model.User, error)
}

// Users provides functionality for CRUD operations on a user.
type Users struct {
	store Store
}

// Quests provides functionality for CRUD operations on quests.
type Quests struct {
	store Store
}

func (u *Users) GetUserByEmail(ctx context.Context, email string) (*model.User, error) {
	user, err := u.store.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// New will instantiate a new instance of Users.
func New(s Store) *Users {
	return &Users{
		store: s,
	}
}

// CreateUser will try to create a user in our database with the provided data if it represents a unique new user.
func (u *Users) CreateUser(ctx context.Context, user *model.UserWithPass) (*model.User, error) {
	passwordHash, err := helpers.HashAndSalt([]byte(*user.Password))
	if err != nil {
		return nil, err
	}
	user.Password = &passwordHash

	// Not much validation needed before storing in the database as the database itself is handling most of that
	// if we were to use something else you would probably want to add validation of inputs here
	createdUser, err := u.store.InsertUser(ctx, user)
	if err != nil {
		return nil, err
	}

	return createdUser, nil
}

// UpdateUser will try to update an existing user in our database with the provided data.
func (u *Users) UpdateUser(ctx context.Context, user *model.UserWithPass) (*model.User, error) {
	if user.Password != nil && *user.Password != "" {
		passwordHash, err := helpers.HashAndSalt([]byte(*user.Password))
		if err != nil {
			return nil, err
		}
		user.Password = &passwordHash
	}

	updatedUser, err := u.store.UpdateUser(ctx, user)
	if err != nil {
		return nil, err
	}

	return updatedUser, nil
}

// GetUser will try to get an existing user in our database with the provided id.
func (u *Users) GetUser(ctx context.Context, id string) (*model.User, error) {
	user, err := u.store.GetUser(ctx, id)
	if err != nil {
		return nil, err
	}

	return user, nil
}
