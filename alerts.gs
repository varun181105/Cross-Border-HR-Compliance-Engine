// ============================================================
// alerts.gs — Pipeline Calculations & Composites
// ============================================================

function processAlertMatrices() {
  var config = getLiveConfig();
  var roster = processCrossBorderRoster();
  var today = new Date();
  today.setHours(0,0,0,0);
  
  var lwdAlerts = [];
  var probationAlerts = [];
  
  var lwdWindow = config["LWD_ALERT_DAYS"] || 45;
  var probWindow = config["PROBATION_ALERT_DAYS"] || 30;
  var standardProbPeriod = config["PROBATION_PERIOD_DAYS"] || 180;
  
  roster.forEach(function(emp) {
    var name = emp["Employee Name"] || emp["Name"];
    var status = (emp["Employment Status"] || "").toString().trim();
    
    // Intern LWD Evaluation Matrix
    if (status.toLowerCase().indexOf("intern") !== -1) {
      var lwdVal = emp["LWD"] || emp["Last Working Day"];
      if (lwdVal) {
        var lwdDate = new Date(lwdVal);
        if (!isNaN(lwdDate.getTime())) {
          lwdDate.setHours(0,0,0,0);
          var diffTime = lwdDate.getTime() - today.getTime();
          var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= lwdWindow) {
            lwdAlerts.push({
              name: name,
              dept: emp["Department"],
              region: emp._region,
              date: lwdDate,
              daysLeft: diffDays,
              tag: diffDays < 0 ? "PASSED EXPIRED" : "CRITICAL RUNTIME"
            });
          }
        }
      }
    }
    
    // Probation Threshold Analysis Layer
    if (status.toLowerCase().indexOf("probation") !== -1) {
      var dojVal = emp["DOJ"] || emp["Date of Joining"];
      if (dojVal) {
        var dojDate = new Date(dojVal);
        if (!isNaN(dojDate.getTime())) {
          var targetConfirmation = new Date(dojDate.getTime() + (standardProbPeriod * 24 * 60 * 60 * 1000));
          targetConfirmation.setHours(0,0,0,0);
          var diffTimeProb = targetConfirmation.getTime() - today.getTime();
          var diffDaysProb = Math.ceil(diffTimeProb / (1000 * 60 * 60 * 24));
          if (diffDaysProb <= probWindow) {
            probationAlerts.push({
              name: name,
              dept: emp["Department"],
              region: emp._region,
              doj: dojDate,
              confirmDate: targetConfirmation,
              daysRemaining: diffDaysProb
            });
          }
        }
      }
    }
  });
  
  return { lwd: lwdAlerts, probation: probationAlerts };
}

/**
 * Computes a weighted operational metric framework for executive visibility (HR Health Score)
 */
function calculateCompositeHRHealth() {
  var roster = processCrossBorderRoster();
  var riskCount = fetchNormalizedData(CONFIG.SHEETS.RISK).length;
  var alerts = processAlertMatrices();
  var config = getLiveConfig();
  var targetProd = config["PRODUCTIVITY_TARGET"] || 75;
  
  var lowProductivityCount = roster.filter(function(e) { return (e._productivity * 100) < targetProd; }).length;
  
  // composite structural formulation algorithm
  var baseScore = 100;
  baseScore -= (riskCount * 3);
  baseScore -= (alerts.lwd.length * 1.5);
  baseScore -= (alerts.probation.length * 1);
  baseScore -= (lowProductivityCount * 0.5);
  
  return Math.max(10, Math.min(100, Math.round(baseScore)));
}
