// ============================================================
// dashboard.gs — Script-rendered Sheet Dashboard
// ============================================================

function renderDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName(CONFIG.SHEETS.DASHBOARD);
  if (!dash) dash = ss.insertSheet(CONFIG.SHEETS.DASHBOARD);
  
  dash.clearContents();
  dash.clearFormats();
  
  var BLUE = "#1a3c5e";
  var LIGHT_BLUE = "#2c5f9e";
  var WHITE = "#ffffff";
  var LIGHT_GRAY = "#f5f7fa";
  var GREEN = "#0f9d58";
  var RED = "#db4437";
  var YELLOW = "#f4b400";
  var ORANGE = "#ff6d00";

  function setCell(row, col, value, bold, bg, color, fontSize) {
    var cell = dash.getRange(row, col);
    cell.setValue(value);
    if (bold) cell.setFontWeight("bold");
    if (bg) cell.setBackground(bg);
    if (color) cell.setFontColor(color);
    if (fontSize) cell.setFontSize(fontSize);
  }

  function setHeader(row, col, value, colspan) {
    var range = dash.getRange(row, col, 1, colspan || 1);
    range.merge();
    range.setValue(value);
    range.setBackground(BLUE);
    range.setFontColor(WHITE);
    range.setFontWeight("bold");
    range.setFontSize(11);
    range.setHorizontalAlignment("center");
  }

  function setSectionTitle(row, value) {
    var range = dash.getRange(row, 1, 1, 8);
    range.merge();
    range.setValue(value);
    range.setBackground(LIGHT_BLUE);
    range.setFontColor(WHITE);
    range.setFontWeight("bold");
    range.setFontSize(10);
    range.setHorizontalAlignment("left");
    var padding = dash.getRange(row, 1);
    padding.setValue("  " + value);
  }

  // ── TITLE (CHANGED TO ENTERPRISE) ──
  var titleRange = dash.getRange(1, 1, 1, 8);
  titleRange.merge();
  titleRange.setValue("🏢 Enterprise Global HR Automation Dashboard");
  titleRange.setBackground(BLUE);
  titleRange.setFontColor(WHITE);
  titleRange.setFontWeight("bold");
  titleRange.setFontSize(16);
  titleRange.setHorizontalAlignment("center");
  dash.setRowHeight(1, 45);

  setCell(2, 1, "Last Updated: " + new Date().toLocaleString(), false, LIGHT_GRAY, "#666666", 9);
  dash.getRange(2, 1, 1, 8).merge();

  var indiaEmps = getIndiaEmployees();
  var usEmps = getUSEmployees();
  var allEmps = getAllEmployees();
  var offboarded = getOffboarded();
  var riskData = getRiskData();
  var lwdAlerts = checkLWDAlerts();
  var probAlerts = checkProbationAlerts();
  var attrition = getQuarterlyAttrition();
  var cfg = getLiveConfig();

  var totalIndia = indiaEmps.length;
  var totalUS = usEmps.length;
  var totalHeadcount = totalIndia + totalUS;

  var confirmed = allEmps.filter(function(e) {
    return (e["Employment Status"] || "").toLowerCase().indexOf("confirmed") !== -1;
  }).length;

  var probation = allEmps.filter(function(e) {
    return (e["Employment Status"] || "").toLowerCase().indexOf("probation") !== -1;
  }).length;

  var interns = allEmps.filter(function(e) {
    return (e["Employment Status"] || "").toLowerCase().indexOf("intern") !== -1;
  }).length;

  var riskCount = riskData.length;

  // ── SECTION 1: KPI STRIP ──
  var row = 4;
  setSectionTitle(row, "📊 KPI OVERVIEW");
  row++;

  var kpiHeaders = ["Total Headcount", "India", "US", "Confirmed", "On Probation", "Interns", "Risk Flags", "LWD Alerts"];
  for (var k = 0; k < kpiHeaders.length; k++) {
    setHeader(row, k + 1, kpiHeaders[k]);
  }
  row++;

  var kpiValues = [totalHeadcount, totalIndia, totalUS, confirmed, probation, interns, riskCount, lwdAlerts.length];
  var kpiBgs = [BLUE, LIGHT_BLUE, LIGHT_BLUE, GREEN, YELLOW, LIGHT_BLUE, RED, ORANGE];
  for (var v = 0; v < kpiValues.length; v++) {
    var kpiCell = dash.getRange(row, v + 1);
    kpiCell.setValue(kpiValues[v]);
    kpiCell.setBackground(kpiBgs[v]);
    kpiCell.setFontColor(WHITE);
    kpiCell.setFontWeight("bold");
    kpiCell.setFontSize(18);
    kpiCell.setHorizontalAlignment("center");
    dash.setRowHeight(row, 50);
  }
  row += 2;

  // ── SECTION 2: LWD ALERTS ──
  setSectionTitle(row, "⚠️ INTERN LWD ALERTS (Within " + (cfg["LWD_ALERT_DAYS"] || 45) + " Days)");
  row++;

  if (lwdAlerts.length === 0) {
    var noAlert = dash.getRange(row, 1, 1, 8);
    noAlert.merge();
    noAlert.setValue("✅ No LWD alerts at this time");
    noAlert.setBackground(GREEN);
    noAlert.setFontColor(WHITE);
    noAlert.setHorizontalAlignment("center");
    row += 2;
  } else {
    var lwdHeaders = ["Employee Name", "Department", "LWD Date", "Days Left", "Status", "", "", ""];
    for (var lh = 0; lh < 5; lh++) {
      setHeader(row, lh + 1, lwdHeaders[lh]);
    }
    row++;

    lwdAlerts.forEach(function(a) {
      dash.getRange(row, 1).setValue(a.name);
      dash.getRange(row, 2).setValue(a.dept);
      dash.getRange(row, 3).setValue(a.lwd ? Utilities.formatDate(new Date(a.lwd), Session.getScriptTimeZone(), "dd-MMM-yyyy") : "");
      dash.getRange(row, 4).setValue(a.daysLeft);
      var statusCell = dash.getRange(row, 5);
      statusCell.setValue(a.status);
      statusCell.setBackground(a.status === "PASSED" ? RED : ORANGE);
      statusCell.setFontColor(WHITE);
      dash.getRange(row, 1, 1, 8).setBackground(LIGHT_GRAY);
      row++;
    });
    row++;
  }

  // ── SECTION 3: PROBATION ALERTS ──
  setSectionTitle(row, "🔔 PROBATION ALERTS (Confirmation Within " + (cfg["PROBATION_ALERT_DAYS"] || 30) + " Days)");
  row++;

  if (probAlerts.length === 0) {
    var noProbAlert = dash.getRange(row, 1, 1, 8);
    noProbAlert.merge();
    noProbAlert.setValue("✅ No probation alerts at this time");
    noProbAlert.setBackground(GREEN);
    noProbAlert.setFontColor(WHITE);
    noProbAlert.setHorizontalAlignment("center");
    row += 2;
  } else {
    var probHeaders = ["Employee Name", "Department", "Date of Joining", "Confirmation Date", "Days Remaining", "", "", ""];
    for (var ph = 0; ph < 5; ph++) {
      setHeader(row, ph + 1, probHeaders[ph]);
    }
    row++;

    probAlerts.forEach(function(a) {
      dash.getRange(row, 1).setValue(a.name);
      dash.getRange(row, 2).setValue(a.dept);
      dash.getRange(row, 3).setValue(a.doj ? Utilities.formatDate(new Date(a.doj), Session.getScriptTimeZone(), "dd-MMM-yyyy") : "");
      dash.getRange(row, 4).setValue(a.confirmDate ? Utilities.formatDate(new Date(a.confirmDate), Session.getScriptTimeZone(), "dd-MMM-yyyy") : "");
      var daysCell = dash.getRange(row, 5);
      daysCell.setValue(a.daysToConfirm);
      daysCell.setBackground(a.daysToConfirm <= 7 ? RED : YELLOW);
      daysCell.setFontColor(WHITE);
      dash.getRange(row, 1, 1, 8).setBackground(LIGHT_GRAY);
      row++;
    });
    row++;
  }

  // ── SECTION 4: DEPARTMENT BREAKDOWN ──
  setSectionTitle(row, "🏬 DEPARTMENT BREAKDOWN");
  row++;

  setHeader(row, 1, "Department");
  setHeader(row, 2, "Headcount");
  setHeader(row, 3, "Confirmed");
  setHeader(row, 4, "Probation");
  setHeader(row, 5, "Interns");
  row++;

  var deptMap = {};
  allEmps.forEach(function(emp) {
    var dept = emp["Department"] || "Unknown";
    var status = (emp["Employment Status"] || "").toLowerCase();
    if (!deptMap[dept]) deptMap[dept] = { total: 0, confirmed: 0, probation: 0, interns: 0 };
    deptMap[dept].total++;
    if (status.indexOf("confirmed") !== -1) deptMap[dept].confirmed++;
    else if (status.indexOf("probation") !== -1) deptMap[dept].probation++;
    else if (status.indexOf("intern") !== -1) deptMap[dept].interns++;
  });

  var deptKeys = Object.keys(deptMap).sort();
  deptKeys.forEach(function(dept) {
    var d = deptMap[dept];
    dash.getRange(row, 1).setValue(dept);
    dash.getRange(row, 2).setValue(d.total);
    dash.getRange(row, 3).setValue(d.confirmed);
    dash.getRange(row, 4).setValue(d.probation);
    dash.getRange(row, 5).setValue(d.interns);
    dash.getRange(row, 1, 1, 5).setBackground(row % 2 === 0 ? LIGHT_GRAY : WHITE);
    row++;
  });
  row++;

  dash.autoResizeColumns(1, 8);
  appendLog("INFO", "Dashboard rendered successfully — " + totalHeadcount + " employees");
  SpreadsheetApp.flush();
}
