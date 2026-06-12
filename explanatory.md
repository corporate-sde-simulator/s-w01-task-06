# Beginner Explanatory Guide: SVC-1841: Fix attendance reporting module

> **Task Type**: Service Task  
> **Domain/Focus**: Backend JavaScript Development

---

## 1. The Goal (In-Depth Beginner Explanation)

### The Core Problem
The attendance reporting module is currently malfunctioning, particularly for night-shift employees. When these employees clock in and out across midnight (for example, from 10 PM to 6 AM), the system incorrectly calculates their worked hours, resulting in negative hour values. This is a significant issue because it not only misrepresents the actual hours worked but also affects the overall attendance statistics and reports generated for these employees. 

Moreover, the attendance percentage calculation is flawed; it currently considers a 7-day week instead of the standard 5 working days (Monday to Friday). This discrepancy can lead to inaccurate reporting of employee attendance, which is crucial for HR analytics and payroll processing. Fixing these bugs is essential to ensure that the attendance reporting module provides accurate data, which in turn supports fair employee evaluations and compliance with labor regulations.

### Jargon Buster (Key Terms Explained)
* **Punch-in/Punch-out**: This refers to the times when an employee starts (punch-in) and ends (punch-out) their work shift. For example, if an employee starts work at 9 AM and finishes at 5 PM, their punch-in is 09:00 and punch-out is 17:00.
* **Overnight Shift**: This is a work shift that extends past midnight. For instance, a shift that starts at 10 PM and ends at 6 AM the next day is considered an overnight shift. Handling these shifts correctly is crucial for accurate hour calculations.
* **Attendance Percentage**: This is a metric that indicates the proportion of days an employee was present at work compared to the total working days in a specified period. For example, if an employee worked 4 out of 5 days in a week, their attendance percentage would be 80%.
* **Unit Tests**: These are automated tests written to verify that individual parts of the code (units) work as intended. They help catch bugs early in the development process and ensure that changes to the code do not introduce new errors.

### Expected Outcome
After implementing the solution, the attendance reporting module should accurately calculate hours worked for all employees, including those on overnight shifts. For example, a punch-in at 22:00 and a punch-out at 06:00 should correctly yield 8 hours worked instead of a negative value. Additionally, the attendance percentage should reflect only the working days (Monday to Friday), providing a more accurate representation of employee attendance. 

**Before vs. After**:
- **Before**: Overnight shifts result in negative hours; attendance percentage calculated over 7 days.
- **After**: Overnight shifts yield correct hours; attendance percentage calculated over 5 working days.

---

## 2. Related Coding Concepts & Syntax (50% Theory, 50% Practice)

### Concept 1: Time Calculation
#### 📘 Theoretical Overview (50%)
Time calculation is essential in applications that track hours worked, especially in attendance systems. It involves converting time from one format to another (like "HH:MM" to minutes) and performing arithmetic operations to determine the total hours worked. If not handled correctly, as seen in our current bug, it can lead to incorrect data being reported, which can affect payroll and employee evaluations.

Key mechanisms include:
- **Time Conversion**: Converting hours and minutes into a single unit (like minutes) for easier calculations.
- **Handling Edge Cases**: Special cases like overnight shifts must be accounted for, where the punch-out time is earlier than the punch-in time.

#### 💻 Syntax & Practical Examples (50%)
* **Language Syntax**:
  ```javascript
  function calculateHours(punchIn, punchOut) {
      const [inH, inM] = punchIn.split(':').map(Number);
      const [outH, outM] = punchOut.split(':').map(Number);
      const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
      return totalMinutes / 60; // Convert minutes back to hours
  }
  ```

* **Real-World Application**:
  ```javascript
  function calculateHours(punchIn, punchOut) {
      const [inH, inM] = punchIn.split(':').map(Number);
      const [outH, outM] = punchOut.split(':').map(Number);
      
      let totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
      
      // Handle overnight shifts
      if (totalMinutes < 0) {
          totalMinutes += 24 * 60; // Add 24 hours in minutes
      }
      
      return totalMinutes / 60; // Convert minutes back to hours
  }
  ```

---

## 3. Step-by-Step Logic & Walkthrough

1. **Step 1: Locate and Analyze the Target File**
   * Navigate to the `attendanceReport.js` file in the `s-w01-task-06` folder.
   * Focus on the `calculateHours` function, specifically lines that handle the punch-in and punch-out times.

2. **Step 2: Input Verification & Validation**
   * Check if the `punchIn` and `punchOut` inputs are valid strings in "HH:MM" format.
   * Ensure that the punch-out time is not earlier than the punch-in time unless it is an overnight shift.

3. **Step 3: Core Implementation / Modification**
   * Modify the `calculateHours` function to handle overnight shifts correctly. If the punch-out time is less than the punch-in time, add 24 hours (in minutes) to the total minutes calculation.

4. **Step 4: Output Verification & Testing**
   * After implementing the changes, run the existing unit tests in `attendanceReport.test.js` to ensure that all tests pass and that the new logic works as expected.

---

## 4. Detailed Walkthrough of Test Cases

### Test Case 1: Standard / Success Case
* **Description**: This test checks if the system correctly calculates hours for a standard shift.
* **Inputs**:
  ```json
  {
      "punchIn": "09:00",
      "punchOut": "17:00"
  }
  ```
* **Step-by-Step Execution Trace**:
  1. The function receives the punch-in and punch-out times.
  2. It splits the times into hours and minutes.
  3. It calculates the total minutes worked: (17 * 60 + 0) - (9 * 60 + 0) = 480 minutes.
  4. Converts minutes to hours: 480 / 60 = 8 hours.
* **Expected Output**: `8`

### Test Case 2: Edge Case / Validation Fail
* **Description**: This test checks how the system handles an overnight shift.
* **Inputs**:
  ```json
  {
      "punchIn": "22:00",
      "punchOut": "06:00"
  }
  ```
* **Step-by-Step Execution Trace**:
  1. The function receives the punch-in and punch-out times.
  2. It splits the times into hours and minutes.
  3. It calculates the total minutes worked: (6 * 60 + 0) - (22 * 60 + 0) = -960 minutes.
  4. Since the total minutes is negative, it adds 1440 minutes (24 hours) to correct the calculation.
  5. The final calculation yields 480 minutes, which converts to 8 hours.
* **Expected Output**: `8`