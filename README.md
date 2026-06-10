# Techolution Global Workforce Automation & Compliance Engine

A enterprise-grade, event-driven automation middleware architecture built to track and optimize Techolution's cross-border operations (India & US regions). The system operates on a decoupled synchronization layout, powering an interactive spreadsheet canvas dashboard layer and a high-performance Single Page Application (SPA) web portal simultaneously.

## 📊 Core Operational Database

* **Google Sheets Infrastructure Engine:** https://docs.google.com/spreadsheets/d/1xZX7efRSX4jFk-Gsb4L0bEI62rmPiQ5Iup-T6jpDucs/edit?gid=1236352742#gid=1236352742

*(Note: Workspace data access permissions are explicitly gated. Authorized reviewers can navigate the automated runtime triggers, configuration models, and testing structures inside this workbook instance).*

---

## 🚀 Key Engineering & Architecture Paradigm Highlights

* **Dynamic Header-Agnostic Parsing Ingestion:** Built using case-insensitive, position-independent column mapping lookups. The background data pipelines dynamically locate operational variables, protecting system stability from unexpected schema changes or row/column movements by non-technical managers.
* **Bi-Surface Real-Time Synchronicity:** Driven by atomic event listeners (`onEdit`) that intercept database updates and push live changes instantly across both the core Google Sheet interface and the web app UI without requiring manual refreshes.
* **Comprehensive 10/10 Compliance Matrices:** Implements advanced 45-day contract termination tracking for interns, 30-day probation forecast modeling, a dynamic department breakdown panel with inline progress rendering, and an Active Corporate Risk Register summary.
* **QA Test Harness & Audit Log Traceability:** Powered by an isolated programmatic validation routine (`runSystemDiagnosticTests`) inside the backend architecture that checks math formulas, pipeline speed, and structural stability, logging outputs for high auditing transparency.

---

## 📁 Repository Script Components

* `_config.gs` — Environment registry, environment constants, and dynamic operational variables state engine.
* `dataLoader.gs` — Header-agnostic cross-border database compiler and financial metric processing middleware.
* `alerts.gs` — Structural contract boundary analysis, time math aggregates, and Composite HR Health Index formulation.
* `dashboard.gs` — Dynamic programmatic grid painter and automatic cell styler for the main spreadsheet view.
* `triggers.gs` — Event-driven interceptors, automated offboarding dropdown tasks, and change log history compilers.
* `orgChart.gs` — Dynamic corporate reporting structure manager and automated hierarchy tree builder.
* `logger.gs` & `tests.gs` — Background pipeline tracers and the internal QA Diagnostic Test Harness.
* `webApp.gs` — Multi-tenant web access security filters and API JSON payload data streaming endpoints.
* `webInterface.html` — Responsive frontend visual layer utilizing asynchronous non-blocking layouts via Tailwind CSS.

---

## 🛠️ Local System Installation Guide

1. Clone or copy the source files from this repository.
2. Open your target data spreadsheet and launch the integrated workspace developer window via **Extensions -> Apps Script**.
3. Replicate the code modules matching the specific `.gs` and `.html` architectural boundaries.
4. Execute the system utility script `forceRebuildDailyTriggers` in `triggers.gs` to initialize background automation engines.
5. Launch `runSystemDiagnosticTests` inside `tests.gs` to verify overall code deployment correctness.
