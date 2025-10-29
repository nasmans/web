import React from "react";
import HolyDaysTimeline from "../../components/HolyDaysTimeline";
import { HOLY_DAYS_NAME } from "../../utils/hijri";

const HolyDaysPage: React.FC = () => {
  return (
    <main>
      <h1>{HOLY_DAYS_NAME}</h1>
      <p>
        توفر هذه الخدمة نظرة شاملة على {HOLY_DAYS_NAME} مع إبراز الليالي المباركة والأوقات المثالية للاستعداد.
        نعتمد على تقويم أم القرى لضمان دقة التواريخ الهجرية ورصد التذكيرات قبل ثلاثة أيام لكل ليلة.
      </p>
      <HolyDaysTimeline />
    </main>
  );
};

export default HolyDaysPage;
