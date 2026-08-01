/**
 * Utility functions for date manipulation in Asia/Dhaka timezone (UTC+6).
 * Ensures daily and monthly reports use local calendar boundaries in Bangladesh.
 */

const DHAKA_OFFSET_HOURS = 6;
const DHAKA_OFFSET_MS = DHAKA_OFFSET_HOURS * 60 * 60 * 1000;

/**
 * Get current date string formatted as YYYY-MM-DD in Asia/Dhaka time.
 */
export function getDhakaTodayString(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date()); // Returns YYYY-MM-DD
}

/**
 * Get current month string formatted as YYYY-MM in Asia/Dhaka time.
 */
export function getDhakaMonthString(): string {
  const today = getDhakaTodayString();
  return today.substring(0, 7);
}

/**
 * Given a YYYY-MM-DD string, return exact Date objects for start and end of that day in UTC+6.
 */
export function getDhakaDayRange(dateStr: string): { start: Date; end: Date } {
  // Ensure format YYYY-MM-DD
  const [year, month, day] = dateStr.split("-").map(Number);
  
  // Construct UTC dates corresponding to 00:00:00.000+06:00 and 23:59:59.999+06:00
  const start = new Date(Date.UTC(year, month - 1, day, 0 - DHAKA_OFFSET_HOURS, 0, 0, 0));
  const end = new Date(Date.UTC(year, month - 1, day, 23 - DHAKA_OFFSET_HOURS, 59, 59, 999));

  return { start, end };
}

/**
 * Given a YYYY-MM string, return exact Date objects for start and end of that month in UTC+6.
 */
export function getDhakaMonthRange(monthStr: string): { start: Date; end: Date } {
  const [year, month] = monthStr.split("-").map(Number);
  
  const start = new Date(Date.UTC(year, month - 1, 1, 0 - DHAKA_OFFSET_HOURS, 0, 0, 0));
  
  // Last day of month
  const lastDay = new Date(Date.UTC(year, month, 0)).getDate();
  const end = new Date(Date.UTC(year, month - 1, lastDay, 23 - DHAKA_OFFSET_HOURS, 59, 59, 999));

  return { start, end };
}

/**
 * Extract YYYY-MM-DD in Asia/Dhaka for any given JS Date.
 */
export function formatDateToDhaka(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
}

/**
 * Generate list of all YYYY-MM-DD strings in a YYYY-MM month.
 */
export function getDaysInMonth(monthStr: string): string[] {
  const [year, month] = monthStr.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month, 0)).getDate();
  const days: string[] = [];

  for (let d = 1; d <= lastDay; d++) {
    const dayPadded = String(d).padStart(2, "0");
    const monthPadded = String(month).padStart(2, "0");
    days.push(`${year}-${monthPadded}-${dayPadded}`);
  }

  return days;
}
