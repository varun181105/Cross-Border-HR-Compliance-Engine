// ============================================================
// orgChart.gs — Programmatic Org Chart Generation Model
// ============================================================

function generateHierarchicalOrgChart() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var chartSheet = ss.getSheetByName(CONFIG.SHEETS.ORG_CHART);
  if (!chartSheet) chartSheet = ss.insertSheet(CONFIG.SHEETS.ORG_CHART);
  
  chartSheet.clear();
  chartSheet.showSheet();
  
  chartSheet.getRange("A1:C1").setValues([["Employee Node", "Reporting Node Manager", "Title Department Identification"]])
            .setBackground("#1e293b").setFontColor("#ffffff").setFontWeight("bold");
            
  var roster = processCrossBorderRoster();
  var rows = [];
  
  roster.forEach(function(emp) {
    var name = emp["Employee Name"] || emp["Name"];
    var mgr = emp["Reporting Manager"] || emp["Manager"];
    var role = emp["Designation"] || "Resource Asset";
    
    if (name) {
      rows.push([name, mgr ? mgr : "", role]);
    }
  });
  
  if (rows.length > 0) {
    chartSheet.getRange(2, 1, rows.length, 3).setValues(rows);
  }
  chartSheet.autoResizeColumns(1, 3);
  appendSystemLog("SUCCESS", "Organizational database structures mapped down inside the tree matrix canvas layers.");
}
