# SVC-1841: Fix attendance reporting module

**Status:** In Progress · **Priority:** Medium
**Sprint:** Sprint 23 · **Story Points:** 5
**Reporter:** Kavitha Rao (HR Analytics Lead) · **Assignee:** You (Intern)
**Due:** End of sprint (Friday)
**Labels:** ackend, javascript, hr-systems, eports
**Epic:** SVC-1810 (HRMS Platform)
**Task Type:** Bug Fix

---

## Description

The attendance reporting module is calculating incorrect hours for night-shift employees and showing wrong attendance percentages in weekly reports. Prachi wrote this before going on maternity leave. The bugs are in the main attendance calculation file.

## Requirements

- Calculate hours worked from punch-in/punch-out records
- Handle overnight shifts (e.g., 22:00 to 06:00)
- Calculate overtime based on 9-hour threshold
- Generate weekly reports with attendance percentage based on working days (Mon-Fri)

## Acceptance Criteria

- [ ] Bug #1 fixed: Overnight shifts produce negative hours (22:00 to 06:00 = -16h instead of 8h)
- [ ] Bug #2 fixed: Attendance percentage uses 7-day week instead of 5 working days
- [ ] All unit tests pass

## Design Notes

See `docs/DESIGN.md` for the HRMS reporting architecture.
See `.context/pr_comments.md` for Prachi's code review notes.
