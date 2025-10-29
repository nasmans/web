import assert from "node:assert/strict";
import process from "node:process";

class TestElement {
  constructor() {
    this.innerHTML = "";
    this._classes = new Set();
    this.classList = {
      add: (...classes) => {
        classes.forEach((cls) => this._classes.add(cls));
      },
      has: (cls) => this._classes.has(cls)
    };
  }
}

global.HTMLElement = TestElement;

/** @type {{ name: string; run: () => void | Promise<void> }[]} */
const tests = [];

function test(name, fn) {
  tests.push({ name, run: fn });
}

const module = await import("../src/dashboard.js");
const { calculateOverview, renderDashboard, getDefaultData } = module;

test("يحسب ملخص المهام", () => {
  const data = getDefaultData();
  const overview = calculateOverview(data.tasks);

  assert.deepEqual(overview, { total: 3, completed: 1, active: 1, blocked: 1 });
});

test("يعيد بناء الواجهة الرئيسية", () => {
  const container = new TestElement();
  const data = getDefaultData();

  const result = renderDashboard(container, data);

  assert.equal(result, container);
  assert.equal(container.classList.has("app-shell"), true);
  assert.match(container.innerHTML, /<h1 id="hero-title">متابعة العمل الجماعي بسهولة<\/h1>/u);

  const sectionMatches = container.innerHTML.match(/<section /g) ?? [];
  const taskMatches = container.innerHTML.match(/class="tasks__item/g) ?? [];

  assert.equal(sectionMatches.length, 3);
  assert.equal(taskMatches.length, data.tasks.length);
});

async function run() {
  const failures = [];

  for (const { name, run } of tests) {
    try {
      await run();
      console.log(`✓ ${name}`);
    } catch (error) {
      console.error(`✖ ${name}`);
      console.error(error instanceof Error ? error.stack : error);
      failures.push(name);
    }
  }

  if (failures.length > 0) {
    process.exitCode = 1;
    console.error(`فشل ${failures.length} اختبار/اختبارات`);
  } else {
    console.log("✅ جميع الاختبارات نجحت");
  }
}

run();
