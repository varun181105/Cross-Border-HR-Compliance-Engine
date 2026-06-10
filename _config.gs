// ============================================================
// _config.gs — All configurable settings live here
// ============================================================

var CONFIG = {
  // Sheet tab names
  SHEETS: {
    INDIA_EMP: "India Employee Database",
    US_EMP: "US Employee Database",
    RM_DATA: "RM Data",
    FINANCE: "Finance",
    PRODUCTIVITY: "Productivity",
    RISK: "Risk Report",
    OFFBOARDED: "Offboarded Resources",
    DASHBOARD: "Dashboard",
    ORG_CHART: "Org Chart",
    DRILL_DOWN: "Drill Down",
    LOGS: "Logs",
    CHANGELOG: "Changelog",
    CONFIG: "_Config"
  },

  // Alert thresholds — change here, nowhere else
  THRESHOLDS: {
    LWD_ALERT_DAYS: 45,
    PROBATION_ALERT_DAYS: 30,
    PROBATION_PERIOD_DAYS: 180,
    PRODUCTIVITY_TARGET: 75
  },

  // Email recipients
  EMAIL: {
    HR_RECIPIENT: "hr@yourcompany.com",
    DIGEST_SUBJECT: "Enterprise HR Automation Dashboard — Daily Alert Digest"
  },

  // Column headers — header-agnostic lookup
  COLUMNS: {
    INDIA: {
      EMP_ID: "Employee ID",
      NAME: "Employee Name",
      DEPT: "Department",
      DESIGNATION: "Designation",
      MANAGER: "Reporting Manager",
      SKILLSET: "Skillset",
      DOJ: "Date of Joining",
      STATUS: "Employment Status",
      LWD: "LWD"
    },
    US: {
      EMP_ID: "Employee ID",
      NAME: "Employee Name",
      DEPT: "Department",
      DESIGNATION: "Designation",
      MANAGER: "Reporting Manager",
      SKILLSET: "Skillset",
      DOJ: "Date of Joining",
      STATUS: "Employment Status",
      ALLOCATION: "Allocation %",
      CTC: "CTC"
    },
    OFFBOARDED: {
      EMP_ID: "Employee ID",
      NAME: "Employee Name",
      DEPT: "Department",
      EXIT_DATE: "Last Working Day",
      QUARTER: "Quarter"
    }
  }
};

function getConfigSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.CONFIG);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEETS.CONFIG);
    sheet.getRange("A1").setValue("Setting");
    sheet.getRange("B1").setValue("Value");
    sheet.getRange("A2").setValue("LWD_ALERT_DAYS");
    sheet.getRange("B2").setValue(45);
    sheet.getRange("A3").setValue("PROBATION_ALERT_DAYS");
    sheet.getRange("B3").setValue(30);
    sheet.getRange("A4").setValue("PROBATION_PERIOD_DAYS");
    sheet.getRange("B4").setValue(180);
    sheet.getRange("A5").setValue("PRODUCTIVITY_TARGET");
    sheet.getRange("B5").setValue(75);
    sheet.getRange("A6").setValue("HR_RECIPIENT");
    sheet.getRange("B6").setValue("hr@yourcompany.com");
  }
  return sheet;
}

function getLiveConfig() {
  var sheet = getConfigSheet();
  var data = sheet.getDataRange().getValues();
  var cfg = {};
  for (var i = 1; i < data.length; i++) {
    cfg[data[i][0]] = data[i][1];
  }
  return cfg;
}
