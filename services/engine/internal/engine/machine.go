package engine

import (
	"errors"
	"time"
)

type Status string

const (
	Running   Status = "RUNNING"
	Waiting   Status = "WAITING"
	Succeeded Status = "SUCCEEDED"
	Failed    Status = "FAILED"
)

type State struct {
	Status     Status
	Step       string
	Attempt    int
	LeaseUntil time.Time
	WakeAt     *time.Time
}

func Acquire(state State, worker string, now time.Time) (State, error) {
	if state.Status != Running {
		return state, errors.New("not runnable")
	}
	if state.LeaseUntil.After(now) {
		return state, errors.New("lease held")
	}
	state.LeaseUntil = now.Add(30 * time.Second)
	return state, nil
}
func Heartbeat(state State, now time.Time) State {
	state.LeaseUntil = now.Add(30 * time.Second)
	return state
}
func Delay(state State, until time.Time) State {
	state.Status = Waiting
	state.WakeAt = &until
	return state
}
func Recover(state State, now time.Time) State {
	if state.Status == Waiting && state.WakeAt != nil && !state.WakeAt.After(now) {
		state.Status = Running
		state.WakeAt = nil
	}
	return state
}
