# Techolution Global Workforce Analytics & Compliance Engine

A production-grade, event-driven automation framework built for Techolution's India and US workforce operations. The system is designed with a completely decoupled architecture, exposing a real-time script-rendered spreadsheet canvas dashboard and a high-availability Single Page Application (SPA) browser portal running on Google Apps Script Runtime (`HtmlService`).

## 🚀 Key Engineering Core Highlights

* **Header-Agnostic Parsing Ingestion:** Built with position-independent mapping lookups. The data pipelines scan headers dynamically, ensuring structural modifications (like row insertions or column shifting by HR) never break the system state.
* **Bi-Surface Real-Time Synchronicity:** Backed by atomic event-driven background daemons (`onEdit`) that push metadata updates concurrently across both the Sheet and the Web portal without manual browser refreshes.
* **10/10 Compliance Scope Features:** Implements 45-day Intern LWD boundaries, 30-day Probation clearance forecasting, dynamic department allocation metrics with progress bars, and an Active Corporate Risk Exceptions register.
* **QA Test Harness & Trace Logs:** Integrated an isolated testing diagnostic routine (`runSystemDiagnosticTests`) that asserts system health instantly against layout drift, writing logs directly to execution traces for full auditing traceability.

## 📁 Repository Structure

* `_config.gs` — Environment configuration and dynamic parameters state engine.
* `dataLoader.gs` — Header-agnostic cross-border roster processing and aggregations.
* `alerts.gs` — Structural milestone evaluation and Composite HR Health Score formulation.
* `dashboard.gs` — Programmatic UI rendering engine for the local spreadsheet canvas.
* `triggers.gs` — Event dispatchers, workflow dropdown actions, and change logging middleware.
* `orgChart.gs` — Programmatic corporate reporting tree builder.
* `logger.gs` & `tests.gs` — System monitoring routines and the Built-in QA Test Harness.
* `webApp.gs` — Web API data stream router and endpoint controller.
* `webInterface.html` — Responsive frontend interface powered by Tailwind CSS and asynchronous JSON data streaming.

## 🛠️ Installation & Deployment

1. Create a copy of the target Google Sheet database.
2. Open **Extensions -> Apps Script** and match the file layout present in this repository.
3. Execute `forceRebuildDailyTriggers` within `triggers.gs` to initialize time-based CRON loops.
4. Run `runSystemDiagnosticTests` to perform the structural integrity check.
5. Click **Deploy -> New Deployment** as a Web App (Set execute access to "Me" and access restriction to "Anyone with a Google Account").
