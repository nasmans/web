import { getUpcomingHolyDays, HOLY_DAYS_NAME } from "../src/utils/hijri";

describe("getUpcomingHolyDays", () => {
  it("returns the three sequential holy nights for Ramadan 1445", () => {
    const reference = new Date(Date.UTC(2024, 2, 20));
    const result = getUpcomingHolyDays(reference);

    expect(result).toHaveLength(3);
    expect(result.map((item) => item.hijriDay)).toEqual([17, 19, 21]);

    expect(result[0].gregorian.toISOString().slice(0, 10)).toBe("2024-03-27");
    expect(result[1].gregorian.toISOString().slice(0, 10)).toBe("2024-03-29");
    expect(result[2].gregorian.toISOString().slice(0, 10)).toBe("2024-03-31");

    result.forEach((item) => {
      const diff =
        (item.gregorian.getTime() - item.reminder.getTime()) / (1000 * 60 * 60 * 24);
      expect(diff).toBe(3);
    });
  });

  it("starts from the next cycle when the reference is before the first holy night", () => {
    const reference = new Date(Date.UTC(2024, 2, 10));
    const result = getUpcomingHolyDays(reference);

    expect(result[0].hijriDay).toBe(17);
    expect(result[0].gregorian.getTime()).toBeGreaterThan(reference.getTime());
  });
});

describe("HOLY_DAYS_NAME", () => {
  it("uses the new naming convention", () => {
    expect(HOLY_DAYS_NAME).toBe("ليالي القدر");
  });
});
