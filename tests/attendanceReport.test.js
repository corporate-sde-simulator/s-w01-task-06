const AttendanceReport = require("../src/attendanceReport.js");
const ReportFormatter = require("../src/reportFormatter.js");

describe("Attendance tracking report builder", () => {
    test("should process valid input", () => {
        const obj = new AttendanceReport();
        expect(obj.process({ key: "val" })).not.toBeNull();
    });
    test("should handle null", () => {
        const obj = new AttendanceReport();
        expect(obj.process(null)).toBeNull();
    });
    test("should track stats", () => {
        const obj = new AttendanceReport();
        obj.process({ x: 1 });
        expect(obj.getStats().processed).toBe(1);
    });
    test("support should work", () => {
        const obj = new ReportFormatter();
        expect(obj.process({ data: "test" })).not.toBeNull();
    });
});
