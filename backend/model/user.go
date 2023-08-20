package model

import (
	"time"
)

// UserWithPass represents a person using our platform.
type UserWithPass struct {
	*User
	Password *string `json:"password" db:"password"`
}

// User represents a person using our platform.
type User struct {
	ID        *string    `json:"id" db:"id"`
	Name      *string    `json:"nickname" db:"nickname"`
	Password  *string    `json:"-" db:"password"`
	Email     *string    `json:"email" db:"email"`
	CreatedAt *time.Time `json:"created_at" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
}

// Field is an enum providing valid fields for filtering.
type Field string

// MatchType is an enum providing valid matching mechanisms for filtering values.
type MatchType string

const (
	// MatchTypeLike represents a LIKE match.
	MatchTypeLike MatchType = "ILIKE"
	// MatchTypeEqual represents an exact match.
	MatchTypeEqual MatchType = "="
)

// Filter is a struct representing a filter for finding users.
type Filter struct {
	MatchType MatchType `json:"match_type"`
	Field     Field     `json:"field"`
	Value     string    `json:"value"`
}
