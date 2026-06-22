# AI Annotation Dashboard

A standalone HTML dashboard prototype for managing AI data annotation workflows.

## Features

- Clickable navigation, cards, queue tabs, role switching, modals, toasts, sample upload flow, and sample CSV export
- Review queue with pending approvals, rejects, and escalation status
- Project manager views for progress, workforce productivity, dataset coverage, quality metrics, and review queue status
- Quality comparison panels for model output versus human labels
- Reviewer views for pending reviews, quality comparison, error tracking, consensus scores, and rejection/correction logs
- Consensus scoring, error tracking, and correction history
- Dataset upload, label configuration, annotation tools, and export status
- Team and reviewer management views

## Code Map

- `index.html` defines the dashboard structure, visible content, modal shell, toast shell, and `data-*` hooks that make elements clickable.
- `styles.css` contains the full visual system: layout, panels, buttons, badges, workbench, modal, toast, and responsive rules.
- `dashboard-data.js` stores navigation titles, subtitles, and scroll targets used by the sidebar.
- `app.js` connects the page behavior: navigation, role switching, queue tabs, detail modals, sample upload, sample CSV export, and keyboard activation.

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any static file server.
