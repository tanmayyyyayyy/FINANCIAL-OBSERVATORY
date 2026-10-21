/**
 * Formatting utilities for Financial Observatory
 */

export function formatCurrency(amount: number, showDecimals: boolean = false): string {
  const rounded = showDecimals ? amount.toFixed(2) : Math.round(amount).toString();
  const parts = rounded.split(".");
  let intPart = parts[0];
  const decimalPart = parts[1];

  // Indian numbering system formatting
  const isNegative = intPart.startsWith("-");
  if (isNegative) intPart = intPart.slice(1);

  let lastThree = intPart.slice(-3);
  const otherNumbers = intPart.slice(0, -3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formattedInt =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  const result = (isNegative ? "−₹" : "₹") + (formattedInt || "0");
  return showDecimals && decimalPart ? `${result}.${decimalPart}` : result;
}

export function formatDate(isoString: string): string {
  try {
    // For ISO date-only strings (YYYY-MM-DD), parse as UTC to avoid timezone
    // shifting the date (e.g. "2026-08-12" becoming Aug 11 in IST +5:30).
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
      const [year, month, day] = isoString.split("-").map(Number);
      const d = new Date(Date.UTC(year, month - 1, day));
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
    }
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
