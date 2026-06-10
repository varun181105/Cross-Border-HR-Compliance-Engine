// ============================================================
// triggers.gs — Automated Active Listeners & Webhooks
// ============================================================

function onEdit(e) {
  if (!e) return;
  var range = e.range;
  var sheet = range.getSheet();
  var sheetName = sheet.getName();
  
  // Formulate dynamic context validation bounds
  if (sheetName !== CONFIG.SHEETS.INDIA_EMP && sheetName !== CONFIG.SHEETS.US_EMP && sheetName !== CONFIG.SHEETS.RISK) return;
  
  var row = range.getRow();
  var col = range.getColumn();
  if (row === 1) return; // Ignore headers schema modifications
  
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var nameCol = getColIndexCaseInsensitive(headers, "Employee Name") || getColIndexCaseInsensitive(headers, "Name");
  var statusCol = getColIndexCaseInsensitive(headers, "Employment Status");
  
  var empName = nameCol ? sheet.getRange(row, nameCol + 1).getValue() : "Unknown Resource";
  var oldVal = e.oldValue || "Null Context";
  var newVal = e.value || "Null Context";
  
  // ── 10/10 WORKFLOW DROPDOWN AUTOMATION ENGINE ──
  if (col === (statusCol + 1) && newVal === "Start Offboarding") {
    executeWorkflowAutomation(sheet, row, empName, "OFFBOARDING_PIPELINE");
    return;
  }
  
  // Append standard trace logs down to compliance auditing sheets
  commitToChangeLog(sheetName, empName, headers[col - 1] || "Cell Factor", oldVal, newVal);
  
  // Asynchronous Interface Re-render Triggering
  renderDashboard();
  generateHierarchicalOrgChart();
}

function executeWorkflowAutomation(sheet, row, empName, type) {
  var userEmail = Session.getActiveUser().getEmail() || "automation@techolution.com";
  
  if (type === "OFFBOARDING_PIPELINE") {
    sheet.getRange(row, getColIndexCaseInsensitive(sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0], "Employment Status") + 1).setValue("Intern (Offboarding Initiated)");
    
    // Stamp the event into data sheets downstream
    commitToChangeLog(sheet.getName(), empName, "Employment Status", "Start Offboarding", "Intern (Offboarding Initiated)");
    
    // Dispatch instant structural alerts to corporate systems
    var mailConfig = getLiveConfig();
    var recipient = mailConfig["HR_RECIPIENT"] || "hr@techolution.com";
    
    MailApp.sendEmail({
      to: recipient,
      subject: "🚨 CRITICAL WORKFLOW RUNTIME: Offboarding Flag Activated for " + empName,
      htmlBody: "<p>The compliance workflow engine detected manual deployment of offboarding protocols for resource <strong>" + empName + "</strong> initiated by administrator target user: " + userEmail + "</p>"
    });
    
    appendSystemLog("WARN", "Workflow Engine forced offboarding state sequence parameters for: " + empName);
    renderDashboard();
  }
}

function commitToChangeLog(sheet, emp, parameter, before, after) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logSheet = ss.getSheetByName(CONFIG.SHEETS.CHANGELOG);
  if (!logSheet) {
    logSheet = ss.insertSheet(CONFIG.SHEETS.CHANGELOG);
    logSheet.appendRow(["Execution ID Stamp", "Target Layer", "Profile Resource", "Parameter Checked", "Historical State", "Mutated State", "Operator Account"]);
  }
  var id = "RUN-" + Math.floor(Math.random() * 900000 + 100000);
  logSheet.appendRow([id, sheet, emp, parameter, before, after, Session.getActiveUser().getEmail()]);
}

function getColIndexCaseInsensitive(headers, target) {
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].toString().toLowerCase().trim() === target.toLowerCase().trim()) return i;
  }
  return -1;
}

function forceRebuildDailyTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) { ScriptApp.deleteTrigger(t); });
  
  ScriptApp.newTrigger('dispatchDailyAnalyticalDigest')
           .timeBased().everyDays(1).atHour(8).create();
           
  appendSystemLog("SUCCESS", "Time-based structural framework binding completed dynamically.");
}

function dispatchDailyAnalyticalDigest() {
  var alerts = processAlertMatrices();
  if (alerts.lwd.length === 0 && alerts.probation.length === 0) return;
  
  var cfg = getLiveConfig();
  var hrEmail = cfg["HR_RECIPIENT"] || "hr@techolution.com";
  
  var html = "<h2>Techolution HR Compliance — System Operational Alert Digest</h2>";
  html += "<p>Automated evaluation summary derived relative to active database execution vectors.</p>";
  
  MailApp.sendEmail({
    to: hrEmail,
    subject: "📋 Techolution Global Workforce Compliance System - Daily Alert Overview",
    htmlBody: html
  });
  appendSystemLog("SUCCESS", "Time-based CRON notification digest routed out to operational targets.");
}
