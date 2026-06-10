// ============================================================
// alerts.gs — Core Alert Evaluation Engine
// ============================================================

function checkLWDAlerts() {
  var cfg = getLiveConfig();
  var threshold = cfg["LWD_ALERT_DAYS"] || CONFIG.THRESHOLDS.LWD_ALERT_DAYS;
  var employees = getAllEmployees();
  var today = new Date();
  var activeAlerts = [];

  employees.forEach(function(emp) {
    var status = emp[CONFIG.COLUMNS.INDIA.STATUS] || "";
    if (status.toString().toLowerCase().indexOf("intern") === -1) return;

    var lwd = emp[CONFIG.COLUMNS.INDIA.LWD] || emp["Last Working Day"];
    if (!lwd) return;

    var lwdDate = new Date(lwd);
    if (isNaN(lwdDate)) return;

    var daysLeft = Math.ceil((lwdDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft <= threshold) {
      activeAlerts.push({
        name: emp[CONFIG.COLUMNS.INDIA.NAME],
        dept: emp[CONFIG.COLUMNS.INDIA.DEPT],
        lwd: lwdDate,
        daysLeft: daysLeft,
        status: daysLeft < 0 ? "PASSED" : "UPCOMING"
      });
    }
  });

  return activeAlerts;
}

function checkProbationAlerts() {
  var cfg = getLiveConfig();
  var alertDays = cfg["PROBATION_ALERT_DAYS"] || CONFIG.THRESHOLDS.PROBATION_ALERT_DAYS;
  var probDays = cfg["PROBATION_PERIOD_DAYS"] || CONFIG.THRESHOLDS.PROBATION_PERIOD_DAYS;
  var employees = getAllEmployees();
  var today = new Date();
  var activeAlerts = [];

  employees.forEach(function(emp) {
    var status = emp[CONFIG.COLUMNS.INDIA.STATUS] || "";
    if (status.toString().toLowerCase().indexOf("probation") === -1) return;

    var doj = emp[CONFIG.COLUMNS.INDIA.DOJ];
    if (!doj) return;

    var dojDate = new Date(doj);
    if (isNaN(dojDate)) return;

    var confirmDate = new Date(dojDate.getTime() + probDays * 24 * 60 * 60 * 1000);
    var daysToConfirm = Math.ceil((confirmDate - today) / (1000 * 60 * 60 * 24));

    if (daysToConfirm <= alertDays) {
      activeAlerts.push({
        name: emp[CONFIG.COLUMNS.INDIA.NAME],
        dept: emp[CONFIG.COLUMNS.INDIA.DEPT],
        doj: dojDate,
        confirmDate: confirmDate,
        daysToConfirm: daysToConfirm
      });
    }
  });

  return activeAlerts;
}
