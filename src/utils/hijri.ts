export const HOLY_DAYS_NAME = "ليالي القدر";

export interface HijriDateParts {
  day: number;
  month: number;
  year: number;
}

export interface HolyDayOccurrence extends HijriDateParts {
  gregorian: Date;
  reminder: Date;
}

const HOLY_DAYS: ReadonlyArray<number> = [17, 19, 21];
const CALENDAR = "islamic-umalqura";

const hijriFormatter = new Intl.DateTimeFormat("en-u-ca-" + CALENDAR, {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

const hijriLongFormatter = new Intl.DateTimeFormat("ar-u-ca-" + CALENDAR, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const gregorianFormatter = new Intl.DateTimeFormat("ar", {
  dateStyle: "full",
});

function cloneToUtcMidnight(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function formatHijri(date: Date): string {
  return hijriLongFormatter.format(date);
}

export function formatGregorian(date: Date): string {
  return gregorianFormatter.format(date);
}

export function getHijriParts(date: Date): HijriDateParts {
  const parts = hijriFormatter.formatToParts(date);
  const day = Number(parts.find((part) => part.type === "day")?.value ?? "0");
  const month = Number(parts.find((part) => part.type === "month")?.value ?? "0");
  const year = Number(parts.find((part) => part.type === "year")?.value ?? "0");

  return { day, month, year };
}

export function getUpcomingHolyDays(referenceDate: Date = new Date()): HolyDayOccurrence[] {
  const occurrences: HolyDayOccurrence[] = [];
  const start = cloneToUtcMidnight(referenceDate);
  let cursor = start;
  let targetMonth: HijriDateParts | null = null;
  let safety = 0;

  while (occurrences.length < HOLY_DAYS.length && safety < 800) {
    const hijri = getHijriParts(cursor);

    if (!targetMonth) {
      if (hijri.day === HOLY_DAYS[0]) {
        targetMonth = { ...hijri };
      }
    }

    if (targetMonth) {
      const expectedDay = HOLY_DAYS[occurrences.length];
      if (hijri.year === targetMonth.year && hijri.month === targetMonth.month && hijri.day === expectedDay) {
        occurrences.push({
          ...hijri,
          gregorian: new Date(cursor.getTime()),
          reminder: addDays(cursor, -3),
        });
      }

      if (
        hijri.year > targetMonth.year ||
        (hijri.year === targetMonth.year && hijri.month > targetMonth.month)
      ) {
        break;
      }
    }

    cursor = addDays(cursor, 1);
    safety += 1;
  }

  return occurrences;
}

export function getHolyDayTimeline(referenceDate: Date = new Date()) {
  return getUpcomingHolyDays(referenceDate).map((occurrence) => ({
    ...occurrence,
    hijriLabel: formatHijri(occurrence.gregorian),
    gregorianLabel: formatGregorian(occurrence.gregorian),
    reminderLabel: formatGregorian(occurrence.reminder),
  }));
}
