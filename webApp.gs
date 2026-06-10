// ============================================================
// webApp.gs — High-Availability Unified Data Stream Router
// ============================================================

function doGet() {
  return HtmlService.createHtmlOutputFromFile('webInterface')
                    .setTitle('Techolution Global Workforce Analytics Portal')
                    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
                    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function streamGlobalEnterpriseMetrics() {
  try {
    var roster = processCrossBorderRoster();
    var alerts = processAlertMatrices();
    var riskRaw = fetchNormalizedData(CONFIG.SHEETS.RISK);
    var offboarded = fetchNormalizedData(CONFIG.SHEETS.OFFBOARDED);
    var healthScore = calculateCompositeHRHealth();
    
    // ── 1. COMPUTE DEPARTMENT DISTRIBUTION ──
    var deptMap = {};
    roster.forEach(function(emp) {
      var dept = emp["Department"] || emp["Dept"] || "Unassigned";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    var departmentBreakdown = Object.keys(deptMap).map(function(k) {
      return { department: k, count: deptMap[k] };
    });

    // ── 2. COMPUTE LIVE ATTRITION TRENDS ──
    var totalActive = roster.length;
    var totalExits = offboarded.length;
    var attritionRate = totalActive > 0 ? ((totalExits / (totalActive + totalExits)) * 100).toFixed(1) : 0;

    // ── 3. MAP RISK ITEMS CLEANLY ──
    var riskList = riskRaw.map(function(r) {
      return {
        name: r["Employee Name"] || r["Name"] || "Unknown",
        riskFactor: r["Risk Factor"] || r["Risk Level"] || "High Risk",
        mitigation: r["Mitigation Status"] || r["Notes"] || "Under Review"
      };
    });
    
    return {
      success: true,
      kpis: {
        totalHeadcount: totalActive,
        indiaCount: roster.filter(function(e){ return e._region === "India"; }).length,
        usCount: roster.filter(function(e){ return e._region === "US"; }).length,
        riskEntries: riskRaw.length,
        healthIndex: healthScore,
        attritionPercentage: attritionRate + "%"
      },
      alerts: {
        lwd: alerts.lwd.map(function(l) {
          return { name: l.name, region: l.region, dept: l.dept, daysLeft: l.daysLeft, tag: l.tag };
        }),
        probation: alerts.probation.map(function(p) {
          return { name: p.name, region: p.region, dept: p.dept, daysRemaining: p.daysRemaining };
        } )
      },
      departmentBreakdown: departmentBreakdown,
      riskRegister: riskList,
      rawRosterData: roster.map(function(e) {
        return {
          id: e["Emp ID"] || e["Employee ID"] || "N/A",
          name: e["Employee Name"] || e["Name"] || "Unknown",
          dept: e["Department"] || "N/A",
          manager: e["Reporting Manager"] || "N/A",
          region: e._region,
          status: e["Employment Status"] || "N/A"
        };
      }),
      timestamp: new Date().toLocaleString()
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}
