// ============================================================
// dataLoader.gs — Header-Agnostic Engine & Aggregations
// ============================================================

function getColumnMapping(sheet) {
  var mapping = {};
  if (!sheet || sheet.getLastColumn() === 0) return mapping;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (headers[i]) mapping[headers[i].toString().trim().toLowerCase()] = i + 1;
  }
  return mapping;
}

function fetchNormalizedData(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(function(h) { return h.toString().trim(); });
  var rows = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] && !row[1]) continue;
    var record = {};
    for (var j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j];
    }
    rows.push(record);
  }
  return rows;
}

function processCrossBorderRoster() {
  var india = fetchNormalizedData(CONFIG.SHEETS.INDIA_EMP).map(function(e) { e._region = "India"; return e; });
  var us = fetchNormalizedData(CONFIG.SHEETS.US_EMP).map(function(e) { e._region = "US"; return e; });
  var finance = fetchNormalizedData(CONFIG.SHEETS.FINANCE);
  var rmData = fetchNormalizedData(CONFIG.SHEETS.RM_DATA);
  
  var finMap = {};
  finance.forEach(function(f) {
    var id = f["Emp ID"] || f["Employee ID"];
    if (id) finMap[id.toString().trim()] = f;
  });
  
  var today = new Date();
  var curMonthStr = today.toLocaleString('default', { month: 'long' }) + " " + today.getFullYear();
  var allocationMap = {};
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rmSheet = ss.getSheetByName(CONFIG.SHEETS.RM_DATA);
  var rmHeaders = rmSheet ? rmSheet.getRange(1, 1, 1, rmSheet.getLastColumn()).getValues()[0] : [];
  var targetAllocCol = -1;
  for (var c = 0; c < rmHeaders.length; c++) {
    if (rmHeaders[c].toString().toLowerCase().indexOf(today.toLocaleString('default', { month: 'long' }).toLowerCase()) !== -1) {
      targetAllocCol = rmHeaders[c].toString().trim();
      break;
    }
  }

  rmData.forEach(function(r) {
    var name = r["Resource Name"] || r["Employee Name"];
    if (name) {
      allocationMap[name.toString().trim().toLowerCase()] = targetAllocCol !== -1 ? r[targetAllocCol] : "0%";
    }
  });

  return india.concat(us).map(function(emp) {
    var empId = (emp["Emp ID"] || emp["Employee ID"] || "").toString().trim();
    var empName = (emp["Employee Name"] || emp["Name"] || "").toString().trim();
    
    var finInfo = finMap[empId] || {};
    emp._ctcMonthly = finInfo["Monthly CTC"] || 0;
    emp._productivity = finInfo["Productivity Average"] || 0;
    emp._currentAllocation = allocationMap[empName.toLowerCase()] || "0%";
    return emp;
  });
}
