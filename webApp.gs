// ============================================================
// webApp.gs — Web App Interface (HtmlService Layer)
// ============================================================

function doGet() {
  return HtmlService.createHtmlOutputFromFile('webInterface')
                    .setTitle('Enterprise Compliance Engine')
                    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getLiveDashboardMetrics() {
  try {
    var indiaCount = getIndiaEmployees().length;
    var usCount = getUSEmployees().length;
    var riskCount = getRiskData().length;
    
    return {
      success: true,
      totalHeadcount: indiaCount + usCount,
      indiaCount: indiaCount,
      usCount: usCount,
      riskEntries: riskCount,
      timestamp: new Date().toLocaleString()
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}
