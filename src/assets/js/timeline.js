import { $, $$ } from "./dom.js";

export function setFooterYear() {
  const el = $("#footer-year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function parseYearMonth(value) {
  if (!value) return null;
  if (value === "present") {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }

  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;

  return {
    year: Number(match[1]),
    month: Number(match[2])
  };
}

function formatDuration(start, end) {
  let totalMonths = (end.year - start.year) * 12 + (end.month - start.month);
  if (totalMonths < 0) totalMonths = 0;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts = [];

  if (years > 0) parts.push(`${years} yr${years === 1 ? "" : "s"}`);
  if (months > 0) parts.push(`${months} mo${months === 1 ? "" : "s"}`);

  return parts.join(" ") || "0 mos";
}

export function initDurationBadges() {
  $$("[data-duration-badge]").forEach(badge => {
    const start = parseYearMonth(badge.dataset.start);
    const end = parseYearMonth(badge.dataset.end);
    if (!start || !end) return;
    badge.textContent = formatDuration(start, end);
  });
}
