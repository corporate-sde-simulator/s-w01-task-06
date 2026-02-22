/**
 * Attendance Report Builder — generates attendance reports from punch-in/out records.
 * 
 * Processes daily attendance data, calculates hours worked, overtime,
 * and generates weekly/monthly reports with compliance checks.
 * 
 * Author: Prachi Desai (on maternity leave)
 * Last Modified: 2026-01-20
 */

const WORK_HOURS = {
    standard: 8,
    halfDay: 4,
    minForPresent: 1,
    overtimeThreshold: 9
};

class AttendanceReport {
    constructor() {
        this.records = [];
        this.employeeProfiles = new Map();
    }

    /**
     * Register an employee profile with their shift info.
     */
    registerEmployee(employeeId, name, shift = 'general') {
        this.employeeProfiles.set(employeeId, {
            name,
            shift,
            registeredAt: new Date().toISOString()
        });
    }

    /**
     * Record a punch-in or punch-out event.
     */
    addPunchRecord(employeeId, date, punchIn, punchOut) {
        if (!this.employeeProfiles.has(employeeId)) {
            throw new Error(`Employee ${employeeId} not registered`);
        }

        const hoursWorked = this.calculateHours(punchIn, punchOut);
        const status = this.determineStatus(hoursWorked);
        const overtime = this.calculateOvertime(hoursWorked);

        this.records.push({
            employeeId,
            date,
            punchIn,
            punchOut,
            hoursWorked: Math.round(hoursWorked * 100) / 100,
            status,
            overtime
        });
    }

    /**
     * Calculate hours between punch-in and punch-out times.
     * Times are in "HH:MM" format (24-hour).
     */
    calculateHours(punchIn, punchOut) {
        const [inH, inM] = punchIn.split(':').map(Number);
        const [outH, outM] = punchOut.split(':').map(Number);

        // BUG: Doesn't handle overnight shifts
        // If punchOut is earlier than punchIn (e.g., in=22:00, out=06:00),
        // result is negative instead of calculating across midnight
        const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
        return totalMinutes / 60;
    }

    /**
     * Determine attendance status based on hours worked.
     */
    determineStatus(hoursWorked) {
        if (hoursWorked >= WORK_HOURS.standard) return 'present';
        if (hoursWorked >= WORK_HOURS.halfDay) return 'half-day';
        if (hoursWorked >= WORK_HOURS.minForPresent) return 'short-leave';
        return 'absent';
    }

    /**
     * Calculate overtime hours (anything beyond threshold).
     */
    calculateOvertime(hoursWorked) {
        if (hoursWorked > WORK_HOURS.overtimeThreshold) {
            return Math.round((hoursWorked - WORK_HOURS.overtimeThreshold) * 100) / 100;
        }
        return 0;
    }

    /**
     * Generate a weekly report for an employee.
     */
    generateWeeklyReport(employeeId, weekStartDate) {
        const profile = this.employeeProfiles.get(employeeId);
        if (!profile) return null;

        const weekStart = new Date(weekStartDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weekRecords = this.records.filter(r => {
            const recordDate = new Date(r.date);
            return r.employeeId === employeeId &&
                recordDate >= weekStart && recordDate <= weekEnd;
        });

        const totalHours = weekRecords.reduce((sum, r) => sum + r.hoursWorked, 0);
        const totalOvertime = weekRecords.reduce((sum, r) => sum + r.overtime, 0);
        const presentDays = weekRecords.filter(r => r.status === 'present').length;

        // BUG: Attendance percentage uses 7 days as denominator
        // But working days in a week is 5 (Mon-Fri), not 7
        // So 5 present days shows as 71% instead of 100%
        const attendancePercent = Math.round((presentDays / 7) * 100);

        return {
            employeeId,
            employeeName: profile.name,
            weekStart: weekStartDate,
            daysPresent: presentDays,
            totalHours: Math.round(totalHours * 100) / 100,
            totalOvertime: Math.round(totalOvertime * 100) / 100,
            attendancePercent,
            records: weekRecords
        };
    }

    /**
     * Get all records for a specific date.
     */
    getDailyReport(date) {
        return this.records.filter(r => r.date === date);
    }

    getRecordCount() {
        return this.records.length;
    }
}

module.exports = { AttendanceReport, WORK_HOURS };
