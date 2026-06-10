// ============================================================
// logger.gs — System Logs & Maintenance Audit Trail
// ============================================================

function appendLog(logType, message) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logSheet = ss.getSheetByName(CONFIG.SHEETS.LOGS);
  
  if (!logSheet) {
    logSheet = ss.insertSheet(CONFIG.SHEETS.LOGS);
    logSheet.appendRow(["Timestamp", "Log Level", "Message", "User"]);
    logSheet.getRange("A1:D1").setBackground("#1a3c5e").setFontColor("#ffffff").setFontWeight("bold");
    logSheet.setFrozenRows(1);
  }
  
  var timestamp = new Date();
  var user = Session.getActiveUser().getEmail() || "System Automator";
  
  logSheet.appendRow([timestamp, logType, message, user]);
  
  var lastRow = logSheet.getLastRow();
  var typeRange = logSheet.getRange(lastRow, 2);
  
  if (logType === "ERROR") {
    typeRange.setBackground("#fce8e6").setFontColor("#c5221f").setFontWeight("bold");
  } else if (logType === "WARN") {
    typeRange.setBackground("#fef7e0").setFontColor("#b06000").setFontWeight("bold");
  } else if (logType === "SUCCESS") {
    typeRange.setBackground("#e6f4ea").setFontColor("#137333").setFontWeight("bold");
  }
  
  if (lastRow > 1500) {
    logSheet.deleteRow(2); 
  }
}
