// ============================================================
// dataLoader.gs — All data reading functions
// ============================================================

function getColIndex(headers, name) {
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].toString().trim().toLowerCase() === name.toString().trim().toLowerCase()) {
      return i;
    }
  }
  return -1;
}

function getSheetData(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0];
  var rows = [];

  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue; 
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j].toString().trim()] = data[i][j];
    }
    rows.push(obj);
  }
  return rows;
}

function getIndiaEmployees() {
  return getSheetData(CONFIG.SHEETS.INDIA_EMP);
}

function getUSEmployees() {
  return getSheetData(CONFIG.SHEETS.US_EMP);
}

function getAllEmployees() {
  var india = getIndiaEmployees().map(function(e) {
    e._region = "India";
    return e;
  });
  var us = getUSEmployees().map(function(e) {
    e._region = "US";
    return e;
  });
  return india.concat(us);
}

function getOffboarded() {
  return getSheetData(CONFIG.SHEETS.OFFBOARDED);
}

function getRiskData() {
  return getSheetData(CONFIG.SHEETS.RISK);
}

function getProductivity() {
  return getSheetData(CONFIG.SHEETS.PRODUCTIVITY);
}

function getCurrentMonthAllocation() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.RM_DATA);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0];
  var today = new Date();
  var currentMonth = today.toLocaleString('default', { month: 'long' });
  var currentYear = today.getFullYear();
  var searchStr = currentMonth + " " + currentYear;

  var monthCol = -1;
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].toString().indexOf(currentMonth) !== -1) {
      monthCol = i;
      break;
    }
  }

  var nameCol = getColIndex(headers, "Resource Name");
  if (nameCol === -1) nameCol = 0;

  var results = [];
  for (var r = 1; r < data.length; r++) {
    if (!data[r][nameCol]) continue;
    results.push({
      name: data[r][nameCol],
      allocation: monthCol !== -1 ? data[r][monthCol] : "N/A",
      month: searchStr
    });
  }
  return results;
}

function getQuarterlyAttrition() {
  var offboarded = getOffboarded();
  var quarterly = {};

  offboarded.forEach(function(emp) {
    var exitDate = emp["Last Working Day"] || emp["LWD"] || emp["Exit Date"];
    if (!exitDate) return;

    var d = new Date(exitDate);
    if (isNaN(d)) return;

    var year = d.getFullYear();
    var month = d.getMonth();
    var quarter = "Q" + (Math.floor(month / 3) + 1) + " " + year;

    if (!quarterly[quarter]) quarterly[quarter] = 0;
    quarterly[quarter]++;
  });

  return quarterly;
}
