/**
 * Report Formatter — formats attendance data into various output formats.
 * 
 * Supports plain text, CSV, and JSON output for HR systems integration.
 * Adds compliance warnings for attendance policy violations.
 * 
 * Author: Prachi Desai (on maternity leave)
 * Last Modified: 2026-01-20
 */

class ReportFormatter {
    constructor() {
        this.complianceRules = {
            minAttendancePercent: 75,
            maxConsecutiveAbsent: 3,
            maxOvertimePerWeek: 10
        };
    }

    /**
     * Format a weekly report as a readable text summary.
     */
    formatAsText(report) {
        if (!report) return 'No data available';

        const lines = [
            `═══════════════════════════════════════`,
            `Attendance Report: ${report.employeeName}`,
            `Week Starting: ${report.weekStart}`,
            `═══════════════════════════════════════`,
            `Days Present:     ${report.daysPresent}`,
            `Total Hours:      ${report.totalHours}`,
            `Overtime Hours:   ${report.totalOvertime}`,
            `Attendance:       ${report.attendancePercent}%`,
            ``,
            `Daily Breakdown:`
        ];

        for (const record of report.records) {
            lines.push(
                `  ${record.date}: ${record.punchIn} - ${record.punchOut} ` +
                `(${record.hoursWorked}h) [${record.status}]`
            );
        }

        // Add compliance warnings
        const warnings = this.checkCompliance(report);
        if (warnings.length > 0) {
            lines.push('', '⚠️ Compliance Warnings:');
            for (const w of warnings) {
                lines.push(`  - ${w}`);
            }
        }

        return lines.join('\n');
    }

    /**
     * Format a weekly report as CSV rows.
     */
    formatAsCSV(report) {
        if (!report) return '';

        const header = 'Date,Employee,PunchIn,PunchOut,Hours,Overtime,Status';
        const rows = report.records.map(r =>
            `${r.date},${report.employeeName},${r.punchIn},${r.punchOut},` +
            `${r.hoursWorked},${r.overtime},${r.status}`
        );

        return [header, ...rows].join('\n');
    }

    /**
     * Check attendance compliance and return warnings.
     */
    checkCompliance(report) {
        const warnings = [];

        // Check attendance percentage
        if (report.attendancePercent < this.complianceRules.minAttendancePercent) {
            warnings.push(
                `Attendance ${report.attendancePercent}% is below minimum ` +
                `${this.complianceRules.minAttendancePercent}%`
            );
        }

        // Check overtime
        if (report.totalOvertime > this.complianceRules.maxOvertimePerWeek) {
            warnings.push(
                `Overtime ${report.totalOvertime}h exceeds weekly limit of ` +
                `${this.complianceRules.maxOvertimePerWeek}h`
            );
        }

        // Check consecutive absences
        const consecutiveAbsent = this.getMaxConsecutiveAbsent(report.records);
        if (consecutiveAbsent > this.complianceRules.maxConsecutiveAbsent) {
            warnings.push(
                `${consecutiveAbsent} consecutive absences exceeds limit of ` +
                `${this.complianceRules.maxConsecutiveAbsent}`
            );
        }

        return warnings;
    }

    /**
     * Count maximum consecutive absent days in records.
     */
    getMaxConsecutiveAbsent(records) {
        let maxStreak = 0;
        let currentStreak = 0;

        // Sort by date
        const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

        for (const record of sorted) {
            if (record.status === 'absent') {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }

        return maxStreak;
    }
}

module.exports = { ReportFormatter };
