// ============================================================
// triggers.gs — UI Listeners & Automation Timers
// ============================================================

function onEdit(e) {
  if (!e) return;
  var range = e.range;
  var sheet = range.getSheet();
  var sheetName = sheet.getName();
  
  if (sheetName !== CONFIG.SHEETS.INDIA_EMP && sheetName !== CONFIG.SHEETS.US_EMP) return;
  
  var row = range.getRow();
  var col = range.getColumn();
  if (row === 1) return; 
  
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var statusColIndex = getColIndex(headers, "Employment Status") + 1;
  var lwdColIndex = getColIndex(headers, "LWD") + 1;
  var nameColIndex = getColIndex(headers, "Employee Name") + 1;
  
  if (col === statusColIndex || col === lwdColIndex) {
    var empName = sheet.getRange(row, nameColIndex).getValue() || "Resource";
    var oldVal = e.oldValue || "Empty";
    var newVal = e.value || "Empty";
    
    logSystemChange(sheetName, empName, sheet.getRange(1, col).getValue(), oldVal, newVal);
    renderDashboard();
  }
}

function logSystemChange(sheet, emp, field, oldV, newV) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var changeSheet = ss.getSheetByName(CONFIG.SHEETS.CHANGELOG);
  
  if (!changeSheet) {
    changeSheet = ss.insertSheet(CONFIG.SHEETS.CHANGELOG);
    changeSheet.appendRow(["Timestamp", "Sheet", "Employee", "Field", "Before", "After", "Editor"]);
    changeSheet.getRange("A1:G1").setBackground("#2c5f9e").setFontColor("#ffffff").setFontWeight("bold");
  }
  
  changeSheet.appendRow([new Date(), sheet, emp, field, oldV, newV, Session.getActiveUser().getEmail()]);
  appendLog("INFO", "Change compiled into Changelog tab for: " + emp);
}

function activateDailyCrons() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) {
    if (t.getHandlerFunction() === 'sendEmailDigest') ScriptApp.deleteTrigger(t);
  });
  
  ScriptApp.newTrigger('sendEmailDigest')
           .timeBased()
           .everyDays(1)
           .atHour(8)
           .create();
           
  appendLog("SUCCESS", "Time-based daily CRON trigger successfully bound.");
}

function sendEmailDigest() {
  var cfg = getLiveConfig();
  var hrEmail = cfg["HR_RECIPIENT"] || CONFIG.EMAIL.HR_RECIPIENT;
  
  var lwd = checkLWDAlerts();
  var prob = checkProbationAlerts();
  
  if (lwd.length === 0 && prob.length === 0) return; 
  
  var body = "<h3>Enterprise Automation Report Summary</h3><p>Active alerts pending validation on your HR Dashboard Sheet.</p>";
  
  MailApp.sendEmail({
    to: hrEmail,
    subject: CONFIG.EMAIL.DIGEST_SUBJECT,
    htmlBody: body
  });
  
  appendLog("SUCCESS", "Daily summary email alert dispatched to: " + hrEmail);
}
