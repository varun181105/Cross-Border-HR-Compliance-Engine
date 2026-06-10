# 🏢 Enterprise Cross-Border HR Compliance & Automation Engine

A production-grade, modular full-stack automation architecture engineered entirely on the Google Workspace ecosystem. This system synchronizes distributed international personnel databases (India & US regions), evaluates structural milestone alerts via automated CRON triggers, logs detailed data modifications for compliance audit trails, and exposes an isolated single-page application (SPA) Web Portal frontend for remote, real-time monitoring.

---

## 🛠️ System Architecture & Modularity
The codebase strictly avoids monolithic scripting, enforcing a cleanly decoupled, multi-file architecture for enterprise maintainability:

* **`_config.gs`**: The central runtime registry managing environment configurations, sheet identifiers, lookups, and global threshold parameters.
* **`dataLoader.gs`**: The operational data-parsing layer equipped with header-agnostic column lookups. It prevents execution degradation even if manual spreadsheet editors insert, delete, or shift raw data columns.
* **`dashboard.gs`**: A script-driven UI component that programmatically builds, formats, and updates visual summary blocks, conditional metrics formatting, and data KPI tiles directly onto the spreadsheet canvas.
* **`alerts.gs`**: The core calculations unit that evaluates dates relative to the active server clock for contract milestones, Last Working Days (LWD), and probation timelines.
* **`triggers.gs`**: Houses event-driven reactive listeners (`onEdit`) for real-time dashboard calculations and time-based clock triggers for automated digest delivery.
* **`logger.gs`**: The system-wide audit framework handling runtime logging, tracking anomalies, and maintaining distinct execution history sheets (INFO, WARN, SUCCESS, ERROR).
* **`webApp.gs`**: The server-side API bridge designed to fetch internal database states, compile metadata, and stream JSON objects securely to external request handlers.
* **`webInterface.html`**: A modern, premium, and fully responsive single-page web dashboard frontend built with HTML5, FontAwesome iconography, and utility-first styling patterns via Tailwind CSS.

---

## 🚀 Key Production Features

1. **Header-Agnostic Parsing Engine**: Dynamic lookup maps ensure that column reordering or manual structural updates inside the database sheets will never break the automation pipeline.
2. **Real-Time Changelog Auditing**: Any modifications to critical workforce parameters (such as status updates or LWD changes) automatically fire a background script to log before/after states, stamp timestamps, and store user metadata.
3. **Automated Alert Digests**: Configured daily time-based CRON triggers to evaluate upcoming compliance thresholds and dispatch beautifully styled HTML analytics reports directly to relevant operational pipelines.
4. **Decoupled Security Layer**: Direct spreadsheet access is completely isolated from end-users. The system streams real-time numerical operational data using asynchronous `google.script.run` bindings.

---

## 📄 Operational Documentation
The repository contains comprehensive architectural guidelines, tracking variables mappings, fail-safe disaster recovery playbooks, and log troubleshooting workflows to ensure clear, seamless handoffs to downstream engineering teams.
