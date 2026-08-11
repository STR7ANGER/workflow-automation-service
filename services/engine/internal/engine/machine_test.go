package engine

import (
	"testing"
	"time"
)

func TestLeaseHeartbeatAndTimerRecovery(t *testing.T) {
	now := time.Unix(0, 0)
	s := State{Status: Running}
	s, err := Acquire(s, "w", now)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = Acquire(s, "x", now); err == nil {
		t.Fatal("expected lease conflict")
	}
	s = Heartbeat(s, now)
	wake := now.Add(time.Minute)
	s = Delay(s, wake)
	if Recover(s, wake).Status != Running {
		t.Fatal("timer did not recover")
	}
}
