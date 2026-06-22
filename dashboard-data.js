// dashboard-data.js
// Stores page-section metadata used by the navigation buttons. Keeping this data
// separate makes it easier to change section titles and scroll targets without
// digging through the UI behavior code.
window.dashboardNavMeta = {
  dashboard: {
    title: "AI Annotation Dashboard",
    text: "Dataset intake, labeling, reviewer QA, consensus, corrections, and export in one workspace.",
    target: "dashboard",
  },
  datasets: {
    title: "Datasets",
    text: "Upload batches, validate schemas, monitor import status, and prepare training exports.",
    target: "datasets",
  },
  labels: {
    title: "Labels",
    text: "Configure entity labels, class rules, examples, reviewer guidance, and quality thresholds.",
    target: "annotate",
  },
  annotate: {
    title: "Annotation Workbench",
    text: "Apply labels, inspect model suggestions, add correction notes, and submit review decisions.",
    target: "annotate",
  },
  reviewers: {
    title: "Reviewer Management",
    text: "Track role dashboards, reviewer productivity, conflict queues, and audit history.",
    target: "reviewers",
  },
  exports: {
    title: "Exports",
    text: "Generate approved datasets, correction audits, and review artifacts.",
    target: "exports",
  },
};
