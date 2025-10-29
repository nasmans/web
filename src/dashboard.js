const DEFAULT_TASKS = [
  {
    id: 1,
    title: "إطلاق الصفحة التعريفية",
    owner: "ليان",
    status: "completed",
    dueDate: "2024-07-01"
  },
  {
    id: 2,
    title: "إعداد حملة التواصل الاجتماعي",
    owner: "سالم",
    status: "in-progress",
    dueDate: "2024-07-05"
  },
  {
    id: 3,
    title: "اختبار سيناريوهات الدفع",
    owner: "هند",
    status: "blocked",
    dueDate: "2024-07-03"
  }
];

const DEFAULT_EVENTS = [
  { id: 1, title: "اجتماع تعقيبي", date: "2024-07-04", location: "غرفة الاجتماعات 2" },
  { id: 2, title: "مراجعة تجربة المستخدم", date: "2024-07-08", location: "عبر الإنترنت" }
];

const STATUS_LABEL = {
  completed: "مكتملة",
  "in-progress": "قيد التنفيذ",
  blocked: "متوقفة"
};

export function calculateOverview(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const active = tasks.filter((task) => task.status === "in-progress").length;
  const blocked = tasks.filter((task) => task.status === "blocked").length;

  return { total, completed, active, blocked };
}

function renderTasks(tasks) {
  return tasks
    .map(
      (task) => `
        <li class="tasks__item tasks__item--${task.status}">
          <div>
            <h3>${task.title}</h3>
            <p class="tasks__meta">
              <span>المسؤول: ${task.owner}</span>
              <span>التسليم: ${task.dueDate}</span>
            </p>
          </div>
          <span class="tasks__status">${STATUS_LABEL[task.status]}</span>
        </li>
      `
    )
    .join("\n");
}

function renderEvents(events) {
  return events
    .map(
      (event) => `
        <li class="events__item">
          <h3>${event.title}</h3>
          <p class="events__meta">
            <span>${event.date}</span>
            <span>${event.location}</span>
          </p>
        </li>
      `
    )
    .join("\n");
}

export function renderDashboard(root, data = {}) {
  if (!(root instanceof HTMLElement)) {
    throw new TypeError("الجذر المستلم يجب أن يكون عنصراً في المستند");
  }

  const tasks = data.tasks ?? DEFAULT_TASKS;
  const events = data.events ?? DEFAULT_EVENTS;
  const overview = calculateOverview(tasks);

  root.classList.add("app-shell");

  root.innerHTML = `
    <header class="hero" aria-labelledby="hero-title">
      <div>
        <p class="hero__eyebrow">لوحة عمليات التسويق</p>
        <h1 id="hero-title">متابعة العمل الجماعي بسهولة</h1>
        <p class="hero__lede">
          تعرض هذه اللوحة أحدث حالة لمشاريع الفريق بحيث يمكنك مشاركة التقدم مع أصحاب المصلحة في دقائق.
        </p>
      </div>
      <div class="hero__insight">
        <p class="hero__metric">${overview.completed}</p>
        <span class="hero__caption">مهام منتهية هذا الأسبوع</span>
      </div>
    </header>

    <main>
      <section aria-labelledby="progress-section" class="panel">
        <div class="panel__header">
          <h2 id="progress-section">ملخص حالة المهام</h2>
          <span class="panel__hint">محدّث تلقائياً كل صباح</span>
        </div>
        <dl class="metrics">
          <div>
            <dt>إجمالي المهام</dt>
            <dd>${overview.total}</dd>
          </div>
          <div>
            <dt>قيد التنفيذ</dt>
            <dd>${overview.active}</dd>
          </div>
          <div>
            <dt>مكتملة</dt>
            <dd>${overview.completed}</dd>
          </div>
          <div>
            <dt>متوقفة</dt>
            <dd>${overview.blocked}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="tasks-section" class="panel">
        <div class="panel__header">
          <h2 id="tasks-section">قائمة الأولويات الحالية</h2>
          <span class="panel__hint">يتم إعادة الترتيب أسبوعياً</span>
        </div>
        <ul class="tasks">
          ${renderTasks(tasks)}
        </ul>
      </section>

      <section aria-labelledby="events-section" class="panel">
        <div class="panel__header">
          <h2 id="events-section">الأحداث القادمة</h2>
          <span class="panel__hint">جهّز المواد قبل 24 ساعة على الأقل</span>
        </div>
        <ul class="events">
          ${renderEvents(events)}
        </ul>
      </section>
    </main>
  `;

  return root;
}

export function getDefaultData() {
  return {
    tasks: DEFAULT_TASKS.map((task) => ({ ...task })),
    events: DEFAULT_EVENTS.map((event) => ({ ...event }))
  };
}
