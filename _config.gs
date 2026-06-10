// ============================================================
// _config.gs — Central Configuration & State Engine
// ============================================================

var CONFIG = {
  SHEETS: {
    INDIA_EMP: "India Employee Database",
    US_EMP: "US Employee Database",
    RM_DATA: "RM Data",
    FINANCE: "Finance Productivity",
    RISK: "Risk Report",
    OFFBOARDED: "Offboarded Resources",
    DASHBOARD: "Dashboard",
    ORG_CHART: "Org Chart",
    DRILL_DOWN: "Drill Down",
    LOGS: "Logs",
    CHANGELOG: "Changelog",
    CONFIG: "_Config",
    QA_TEST: "QA Test Harness"
  }
};

/**
 * Automatically initializes or reads live environment configurations from the sheet layer
 */
function getLiveConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.CONFIG);
  
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEETS.CONFIG);
    sheet.appendRow(["Configuration Parameter", "Active Operational Value", "Documentation Reference"]);
    sheet.appendRow(["LWD_ALERT_DAYS", 45, "Intern offboarding notification window"]);
    sheet.appendRow(["PROBATION_ALERT_DAYS", 30, "Probation tracking evaluation threshold"]);
    sheet.appendRow(["PROBATION_PERIOD_DAYS", 180, "Standard employment validation window"]);
    sheet.appendRow(["PRODUCTIVITY_TARGET", 75, "Minimum targeted structural productivity percentage"]);
    sheet.appendRow(["HR_RECIPIENT", "hr@techolution.com", "Target email pipeline endpoint"]);
    sheet.getRange("A1:C1").setBackground("#1e3a8a").setFontColor("#ffffff").setFontWeight("bold");
    sheet.autoResizeColumns(1, 3);
  }
  
  var data = sheet.getDataRange().getValues();
  var liveMap = {};
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      liveMap[data[i][0].toString().trim()] = data[i][1];
    }
  }
  return liveMap;
}
