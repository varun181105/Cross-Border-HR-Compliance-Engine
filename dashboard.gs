// ============================================================
// dashboard.gs — Full Sheet Render Canvas Paint Engine
// ============================================================

function renderDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.DASHBOARD);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEETS.DASHBOARD);
  
  sheet.clearContents();
  sheet.clearFormats();
  sheet.showSheet();
  
  var roster = processCrossBorderRoster();
  var alerts = processAlertMatrices();
  var risk = fetchNormalizedData(CONFIG.SHEETS.RISK);
  var offboarded = fetchNormalizedData(CONFIG.SHEETS.OFFBOARDED);
  var config = getLiveConfig();
  var healthScore = calculateCompositeHRHealth();
  
  // Theme Variables
  var NVY = "#1e3a8a", SIL = "#f8fafc", BORDER = "#e2e8f0", TXT = "#0f172a";
  
  sheet.getRange(1, 1, 1, 10).merge().setValue("🏢 Techolution Corporate HR Analytics Dashboard Pipeline")
       .setBackground(NVY).setFontColor("#ffffff").setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sheet.setRowHeight(1, 40);
  
  sheet.getRange(2, 1, 1, 10).merge().setValue("📊 Real-Time Operations Data Engine State Sync: " + new Date().toLocaleString())
       .setFontStyle("italic").setFontColor("#64748b").setFontSize(9);

  // ── 1. CORE KPI BLOCKS ──
  var row = 4;
  sheet.getRange(row, 1, 1, 10).merge().setValue("⚡ REAL-TIME KEY PERFORMANCE INDICATORS").setBackground("#334155").setFontColor("#ffffff").setFontWeight("bold").setFontSize(10);
  row++;
  
  var kpis = [
    ["Total Roster", roster.length],
    ["India Roster", roster.filter(function(e){return e._region==="India"}).length],
    ["US Roster", roster.filter(function(e){return e._region==="US"}).length],
    ["HR Health Score", healthScore + "%"],
    ["Risk Indicators", risk.length],
    ["Active LWD Alerts", alerts.lwd.length]
  ];
  
  for(var k=0; k<kpis.length; k++) {
    sheet.getRange(row, k+1).setValue(kpis[k][0]).setBackground("#f1f5f9").setFontWeight("bold").setFontSize(9).setHorizontalAlignment("center");
    sheet.getRange(row+1, k+1).setValue(kpis[k][1]).setFontSize(16).setFontWeight("bold").setHorizontalAlignment("center").setFontColor(kpis[k][0]==="Risk Indicators" && risk.length>0 ? "#dc2626":"#1e3a8a");
  }
  sheet.getRange(row, 1, 2, kpis.length).setBorder(true, true, true, true, true, true, BORDER, SpreadsheetApp.BorderStyle.SOLID);
  row += 3;
  
  // ── 2. INTERN CONTRACT EXPIRATIONS (LWD) ──
  sheet.getRange(row, 1, 1, 10).merge().setValue("⚠️ CRITICAL INTERN EXPIRATION TRACKER (45 DAYS WINDOW)").setBackground("#b91c1c").setFontColor("#ffffff").setFontWeight("bold").setFontSize(10);
  row++;
  
  sheet.getRange(row, 1, 1, 5).setValues([["Employee Candidate", "Regional Domain", "Department Unit", "LWD Date Target", "Calculated Delta Timeline"]]).setBackground("#f8fafc").setFontWeight("bold");
  row++;
  
  if(alerts.lwd.length === 0) {
    sheet.getRange(row, 1, 1, 5).merge().setValue("✅ No structural offboarding alerts pending verification inside execution loops.").setFontColor("#15803d").setFontStyle("italic");
    row++;
  } else {
    alerts.lwd.forEach(function(l) {
      sheet.appendRow([l.name, l.region, l.dept, Utilities.formatDate(l.date, Session.getScriptTimeZone(), "yyyy-MM-dd"), l.daysLeft + " Days Remaining"]);
      row++;
    });
  }
  row += 2;

  // ── 3. PROBATION CLEARANCE MILESTONES ──
  sheet.getRange(row, 1, 1, 10).merge().setValue("🔔 UPCOMING EMPLOYEE PROBATION CLEARANCE FORECAST (30 DAYS WINDOW)").setBackground("#d97706").setFontColor("#ffffff").setFontWeight("bold").setFontSize(10);
  row++;
  
  sheet.getRange(row, 1, 1, 5).setValues([["Employee Name", "Region", "Department", "Target Confirmation Date", "Days Remaining Timeline"]]).setBackground("#f8fafc").setFontWeight("bold");
  row++;
  
  if(alerts.probation.length === 0) {
    sheet.getRange(row, 1, 1, 5).merge().setValue("✅ No operational probation cycles require escalation thresholds.").setFontColor("#15803d").setFontStyle("italic");
    row++;
  } else {
    alerts.probation.forEach(function(p) {
      sheet.appendRow([p.name, p.region, p.dept, Utilities.formatDate(p.confirmDate, Session.getScriptTimeZone(), "yyyy-MM-dd"), p.daysRemaining + " Days Left"]);
      row++;
    });
  }
  row += 2;

  // ── 4. FINANCE PRODUCTIVITY HIGHLIGHTS ──
  sheet.getRange(row, 1, 1, 10).merge().setValue("📊 HIGH-RISK PERFORMANCE & PRODUCTIVITY UNDERPERFORMANCE TRACE").setBackground("#475569").setFontColor("#ffffff").setFontWeight("bold").setFontSize(10);
  row++;
  
  sheet.getRange(row, 1, 1, 4).setValues([["Employee", "Region", "Department", "Productivity Registered"]]).setBackground("#f8fafc").setFontWeight("bold");
  row++;
  
  var targetProdVal = config["PRODUCTIVITY_TARGET"] || 75;
  var lowProd = roster.filter(function(e) { return (e._productivity * 100) < targetProdVal; });
  
  if(lowProd.length === 0) {
    sheet.getRange(row, 1, 1, 4).merge().setValue("✅ All resources actively clear operational efficiency metrics targets.").setFontColor("#15803d").setFontStyle("italic");
    row++;
  } else {
    lowProd.forEach(function(lp) {
      sheet.appendRow([lp["Employee Name"] || lp["Name"], lp._region, lp["Department"], (lp._productivity * 100) + "%"]);
      row++;
    });
  }
  
  sheet.autoResizeColumns(1, 10);
  appendSystemLog("SUCCESS", "Programmatic Spreadsheet Summary UI execution redrawn completely.");
}
