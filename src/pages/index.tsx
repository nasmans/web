import React from "react";
import HolyDaysTimeline from "../components/HolyDaysTimeline";
import { HOLY_DAYS_NAME } from "../utils/hijri";

const HomePage: React.FC = () => {
  return (
    <main>
      <section>
        <h1>الصفحة العامة</h1>
        <p>
          نقدم في هذه الصفحة لمحة سريعة عن أهم الأنشطة الموسمية، وعلى رأسها {HOLY_DAYS_NAME}.
          يساعدك الجدول الزمني التالي في التحضير لهذه الليالي المباركة، مع تذكير قبل ثلاثة أيام لكل موعد.
        </p>
      </section>
      <HolyDaysTimeline />
    </main>
  );
};

export default HomePage;
