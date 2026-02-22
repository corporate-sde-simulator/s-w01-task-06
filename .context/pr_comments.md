# PR Review - Attendance tracking report builder (by Deepak Gupta)

## Reviewer: Neha Sharma
---

**Overall:** Good foundation but critical bugs need fixing before merge.

### `attendanceReport.js`

> **Bug #1:** Working hours calculation subtracts lunch break twice showing 7hrs instead of 8hrs
> This is the higher priority fix. Check the logic carefully and compare against the design doc.

### `reportFormatter.js`

> **Bug #2:** Monthly summary counts Saturdays as working days even when company has 5-day week policy
> This is more subtle but will cause issues in production. Make sure to add a test case for this.

---

**Deepak Gupta**
> Acknowledged. I have documented the issues for whoever picks this up.
