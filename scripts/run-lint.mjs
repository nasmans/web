import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const SOURCE_DIR = fileURLToPath(new URL("../src", import.meta.url));
const TARGET_EXTENSIONS = new Set([".js", ".css", ".html"]);
const PATTERNS = [
  { regex: /console\.log\s*\(/, message: "إزالة استدعاءات console.log من الشيفرة" },
  { regex: /debugger/, message: "إزالة أوامر debugger من الشيفرة" },
  { regex: /TODO/i, message: "يرجى معالجة الملاحظات المؤقتة قبل الدمج" }
];

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(path)));
    } else if (TARGET_EXTENSIONS.has(extname(entry.name))) {
      files.push(path);
    }
  }

  return files;
}

async function run() {
  const issues = [];
  const files = await collectFiles(SOURCE_DIR);

  for (const filePath of files) {
    const contents = await readFile(filePath, "utf8");
    for (const pattern of PATTERNS) {
      if (pattern.regex.test(contents)) {
        issues.push({ file: filePath, message: pattern.message });
      }
    }

    const trailingWhitespaceLine = contents.split(/\r?\n/).findIndex((line) => /\s$/.test(line));
    if (trailingWhitespaceLine !== -1) {
      issues.push({
        file: filePath,
        message: `إزالة الفراغات الزائدة في نهاية السطر ${trailingWhitespaceLine + 1}`
      });
    }
  }

  if (issues.length > 0) {
    console.error("فشل الفحص lint بسبب:");
    for (const issue of issues) {
      console.error(`- ${issue.file}: ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("✅ اكتملت عملية lint بدون مخالفات");
}

run().catch((error) => {
  console.error("حدث خطأ أثناء تنفيذ lint:");
  console.error(error);
  process.exitCode = 1;
});
