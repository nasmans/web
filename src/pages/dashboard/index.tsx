import React from "react";
import HolyDaysTimeline from "../../components/HolyDaysTimeline";
import { HOLY_DAYS_NAME } from "../../utils/hijri";

const DashboardPage: React.FC = () => {
  return (
    <main>
      <header>
        <h1>لوحة التحكم</h1>
        <p>
          يعرض هذا القسم حالة {HOLY_DAYS_NAME} القادمة، بما في ذلك مواعيد التذكير قبل ثلاثة أيام لمساعدة الفرق على الاستعداد اللوجستي.
        </p>
      </header>
      <HolyDaysTimeline />
    </main>
  );
};

export default DashboardPage;
