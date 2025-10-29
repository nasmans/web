import React from "react";
import { getHolyDayTimeline, HOLY_DAYS_NAME } from "../utils/hijri";

export interface HolyDaysTimelineProps {
  referenceDate?: Date;
}

export const HolyDaysTimeline: React.FC<HolyDaysTimelineProps> = ({ referenceDate }) => {
  const [entries, setEntries] = React.useState(() => getHolyDayTimeline(referenceDate));

  React.useEffect(() => {
    setEntries(getHolyDayTimeline(referenceDate));
  }, [referenceDate?.getTime()]);

  return (
    <section aria-labelledby="holy-days-heading">
      <header>
        <h2 id="holy-days-heading">{HOLY_DAYS_NAME}</h2>
        <p>
          نتابع {HOLY_DAYS_NAME} في الليالي ١٧ و١٩ و٢١ من شهر رمضان بناءً على تقويم أم القرى،
          مع إرسال تذكير قبل ثلاثة أيام لكل ليلة.
        </p>
      </header>
      <ol>
        {entries.map((entry) => (
          <li key={`${entry.hijriYear}-${entry.hijriMonth}-${entry.hijriDay}`}>
            <h3>ليلة {entry.hijriDay}</h3>
            <p>
              <strong>التاريخ الهجري:</strong> {entry.hijriLabel}
            </p>
            <p>
              <strong>التاريخ الميلادي:</strong> {entry.gregorianLabel}
            </p>
            <p>
              <strong>موعد التذكير:</strong> {entry.reminderLabel}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default HolyDaysTimeline;
