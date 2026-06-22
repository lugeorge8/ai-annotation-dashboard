// app.js
// Wires the static dashboard markup into an interactive prototype: navigation,
// role switching, queue tabs, detail modals, toasts, uploads, and sample exports.

// Pull static navigation labels and targets from dashboard-data.js.
const navMeta = window.dashboardNavMeta || {};

const modal = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalPrimary = document.getElementById("modalPrimary");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");
let toastTimer;

// Icon rendering is centralized because new modal content can include Lucide icons.
function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { width: 18, height: 18, "stroke-width": 2 } });
  }
}

// Toasts give immediate feedback for prototype actions without changing page state.
function showToast(message) {
  toastText.textContent = message;
  toast.classList.remove("hidden");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.add("hidden"), 2600);
}

function closeModal() {
  modal.classList.add("hidden");
}

// Most clickable elements feed title, body, action text, and stats into this one modal.
function showModal(title, description, action, stats = []) {
  modalTitle.textContent = title;
  modalBody.innerHTML = "";
  const copy = document.createElement("p");
  copy.textContent = description;
  modalBody.append(copy);

  if (stats.length) {
    const grid = document.createElement("div");
    grid.className = "detail-grid";
    for (let index = 0; index < stats.length; index += 2) {
      const cell = document.createElement("div");
      cell.className = "detail-cell";
      cell.innerHTML = `<span>${stats[index]}</span><strong>${stats[index + 1] ?? ""}</strong>`;
      grid.append(cell);
    }
    modalBody.append(grid);
  }

  modalPrimary.textContent = action || "Continue";
  modalPrimary.onclick = () => {
    closeModal();
    showToast(`${title}: ${modalPrimary.textContent} selected`);
  };
  modal.classList.remove("hidden");
  refreshIcons();
}

// data-detail attributes use pipe-delimited content so static HTML can define modal copy.
function detailFromDataset(value) {
  const parts = value.split("|");
  return {
    title: parts[0],
    description: parts[1] || "",
    action: parts[2] || "Continue",
    stats: parts.slice(3),
  };
}

// Sidebar navigation updates both the active button and the topbar context.
function activateNav(key) {
  const meta = navMeta[key];
  if (!meta) return;
  document.querySelectorAll(".nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.nav === key);
  });
  document.querySelector(".title h1").textContent = meta.title;
  document.querySelector(".title p").textContent = meta.text;
  const target = document.getElementById(meta.target);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: key === "dashboard" ? "start" : "center" });
  }
}

// Role tabs switch between manager-focused cards and reviewer-focused tools.
function setRole(role) {
  document.querySelectorAll(".role-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.role === role);
  });
  const managerGrid = document.querySelector(".manager-grid");
  const reviewerTools = document.getElementById("reviewer-tools");
  managerGrid.classList.toggle("hidden", role !== "manager");
  reviewerTools.classList.toggle("hidden", role !== "reviewer");
  showToast(role === "manager" ? "Project manager view selected" : "Reviewer view selected");
}

// Workbench tabs keep the review queue, QA panel, and logs in one compact area.
function setWorkbenchTab(tab) {
  document.querySelectorAll(".segmented button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.tabPanel !== tab);
  });
}

// Export is a client-only sample CSV so the prototype works without a backend.
function downloadExport() {
  const rows = [
    "id,text,label,review_status,consensus",
    "24A-001,Jordan Kim,Person,approved,2_of_3",
    "24A-002,Northstar Analytics LLC,Organization,approved,3_of_3",
    "24B-014,missing limitation of liability clause,Risk Clause,correction_requested,1_of_3",
  ];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "annotation-export-sample.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Sample export generated");
}

// Maps data-action values in index.html to the prototype behavior they trigger.
function handleAction(action, source) {
  const actions = {
    search: () =>
      showModal("Search", "Search batches, records, labels, reviewers, and correction notes.", "Run Search", [
        "Indexed records",
        "24,900",
        "Saved filters",
        "6",
        "Recent result",
        "Batch 24-A",
      ]),
    filters: () =>
      showModal("Filters", "Filter the dashboard by project, reviewer, label class, due date, and review status.", "Apply Filters", [
        "Project",
        "Legal extraction",
        "Status",
        "Needs review",
        "Reviewer",
        "All",
      ]),
    "new-batch": () =>
      showModal("New Batch", "Create a new annotation batch from an uploaded dataset and assign labeling rules.", "Create Batch", [
        "Default format",
        "JSONL",
        "Consensus",
        "2 of 3",
        "Review SLA",
        "24h",
      ]),
    export: downloadExport,
    upload: () => {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.accept = ".csv,.jsonl,.json,.txt,.pdf,image/*";
      input.onchange = () => showToast(`${input.files.length} file${input.files.length === 1 ? "" : "s"} staged for upload`);
      input.click();
    },
    undo: () => showToast("Last label edit reverted"),
    "submit-review": () =>
      showModal("Submit Review", "Submit this record with the selected decision and correction notes.", "Submit Decision", [
        "Decision",
        document.getElementById("decision").value,
        "Selected label",
        document.getElementById("labelType").value,
        "Consensus impact",
        "+1 reviewer",
      ]),
    "open-batch": () => {
      const detail = source.closest("[data-detail]");
      if (detail) {
        const data = detailFromDataset(detail.dataset.detail);
        showModal(data.title, data.description, data.action, data.stats);
      }
    },
    compare: () =>
      showModal("Quality Comparison", "Review model, annotator, and reviewer outputs side by side before approval.", "Open Side-by-Side", [
        "Model",
        "87%",
        "Annotator",
        "91%",
        "Reviewer",
        "96%",
      ]),
    "close-modal": closeModal,
  };
  actions[action]?.();
}

// Attach event listeners after the deferred script runs and the DOM is ready.
document.querySelectorAll(".nav button").forEach((button) => {
  button.addEventListener("click", () => activateNav(button.dataset.nav));
});

document.querySelectorAll(".role-tabs button").forEach((button) => {
  button.addEventListener("click", () => setRole(button.dataset.role));
});

document.querySelectorAll(".segmented button").forEach((button) => {
  button.addEventListener("click", () => setWorkbenchTab(button.dataset.tab));
});

document.querySelectorAll("[data-action]").forEach((element) => {
  element.addEventListener("click", (event) => {
    event.stopPropagation();
    handleAction(element.dataset.action, element);
  });
});

document.querySelectorAll("[data-detail]").forEach((element) => {
  element.addEventListener("click", () => {
    const data = detailFromDataset(element.dataset.detail);
    showModal(data.title, data.description, data.action, data.stats);
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      element.click();
    }
  });
});

document.querySelectorAll("[data-jump]").forEach((element) => {
  element.addEventListener("click", () => activateNav(element.dataset.jump));
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateNav(element.dataset.jump);
    }
  });
});

document.querySelectorAll("[data-label]").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll("[data-label]").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    document.getElementById("labelType").value = chip.dataset.label;
    showToast(`${chip.dataset.label} label selected`);
  });
  chip.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      chip.click();
    }
  });
});

document.getElementById("labelType").addEventListener("change", (event) => {
  document.querySelectorAll("[data-label]").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.label === event.target.value);
  });
  showToast(`${event.target.value} selected`);
});

document.getElementById("decision").addEventListener("change", (event) => {
  showToast(`Decision set to: ${event.target.value}`);
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

refreshIcons();
