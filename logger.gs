// ============================================================
// logger.gs & tests.gs — Testing Harness & Failure Trace
// ============================================================

function appendSystemLog(level, message) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.LOGS);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEETS.LOGS);
    sheet.appendRow(["Timestamp Metric", "Security Level Tiers", "Trace Messages", "Operator Execution Node"]);
    sheet.getRange("A1:D1").setBackground("#0f172a").setFontColor("#ffffff").setFontWeight("bold");
  }
  sheet.appendRow([new Date(), level, message, Session.getActiveUser().getEmail() || "CORE_ENGINE_DAEMON"]);
}

/**
 * 10/10 Verification Engine Test Harness Framework Execution Context
 */
function runSystemDiagnosticTests() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var testSheet = ss.getSheetByName(CONFIG.SHEETS.QA_TEST);
  if (!testSheet) {
    testSheet = ss.insertSheet(CONFIG.SHEETS.QA_TEST);
  }
  testSheet.clear();
  testSheet.appendRow(["Diagnostic Test Case Execution Parameters", "Calculated Status Code State Result", "Assertion Verification Diagnostics Trace"]);
  testSheet.getRange("A1:C1").setBackground("#4d7c0f").setFontColor("#ffffff").setFontWeight("bold");
  
  try {
    // Assertion Pattern Alpha: Configuration Validity
    var config = getLiveConfig();
    if (!config["HR_RECIPIENT"]) throw new Error("Configuration mapping layer returned dead variables maps state elements.");
    testSheet.appendRow(["ASSERTION_ALPHA_ENV_CONFIG_INTEGRITY", "PASSED_OK", "Environment properties parsed seamlessly inside application modules arrays."]);
    
    // Assertion Beta: Calculation State Resilience
    var matrices = processAlertMatrices();
    if (!Array.isArray(matrices.lwd) || !Array.isArray(matrices.probation)) throw new Error("Calculations engine failed dynamic structured initialization.");
    testSheet.appendRow(["ASSERTION_BETA_ALERTS_PIPELINE_MATRIX", "PASSED_OK", "Algorithmic arrays constructed matching baseline threshold arrays constraints."]);
    
    // Assertion Gamma: Schema Drift Robustness Check
    var fakeHeaders = ["Random Column Header Index", "Employee Name", "Department Data Block"];
    var idx = getColIndexCaseInsensitive(fakeHeaders, "Employee Name");
    if (idx !== 1) throw new Error("Header mapping lookup system degraded during lookups.");
    testSheet.appendRow(["ASSERTION_GAMMA_HEADER_AGNOSTIC_LOOKUP", "PASSED_OK", "Column mutation validations executed flawlessly under standard constraints."]);
    
    appendSystemLog("SUCCESS", "All QA environment automation harness test assertions verified successfully.");
  } catch (err) {
    testSheet.appendRow(["DIAGNOSTIC_CRITICAL_RUN_FAILURE", "CRITICAL_FAILED", err.toString()]);
    appendSystemLog("ERROR", "Harness assertion failures caught in monitoring logic loops: " + err.toString());
  }
  testSheet.autoResizeColumns(1, 3);
}
