"use client";

import { useMemo, useState } from "react";
import type { BiologyExamResource } from "@/lib/fetchBiologyQuestions";

const SORT_OPTIONS = [
  { id: "downloads-desc", label: "مرتب‌سازی بر اساس بیشترین دانلود" },
  { id: "downloads-asc", label: "مرتب‌سازی بر اساس کمترین دانلود" },
  { id: "title", label: "مرتب‌سازی الفبایی عنوان" },
];

type SortOption = (typeof SORT_OPTIONS)[number]["id"];

type ExamExplorerProps = {
  entries: BiologyExamResource[];
};

const intlNumber = new Intl.NumberFormat("fa-IR");

const normalize = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

export function ExamExplorer({ entries }: ExamExplorerProps) {
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [onlyWithAnswer, setOnlyWithAnswer] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>("downloads-desc");

  const sections = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((item) => {
      if (item.section) {
        set.add(item.section);
      }
    });
    return Array.from(set);
  }, [entries]);

  const filtered = useMemo(() => {
    const query = normalize(search);

    return entries.filter((item) => {
      if (sectionFilter !== "all" && item.section !== sectionFilter) {
        return false;
      }
      if (onlyWithAnswer && !item.hasAnswer) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = normalize(
        [
          item.title,
          item.section,
          item.city ?? "",
          item.schoolType ?? "",
          item.tags.join(" "),
        ].join(" "),
      );

      return haystack.includes(query);
    });
  }, [entries, search, sectionFilter, onlyWithAnswer]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortOption === "downloads-desc") {
      return list.sort((a, b) => (b.downloadCount ?? 0) - (a.downloadCount ?? 0));
    }
    if (sortOption === "downloads-asc") {
      return list.sort((a, b) => (a.downloadCount ?? 0) - (b.downloadCount ?? 0));
    }
    if (sortOption === "title") {
      return list.sort((a, b) => a.title.localeCompare(b.title, "fa"));
    }
    return list;
  }, [filtered, sortOption]);

  const grouped = useMemo(() => {
    const map = new Map<string, BiologyExamResource[]>();
    sorted.forEach((item) => {
      if (!map.has(item.section)) {
        map.set(item.section, []);
      }
      map.get(item.section)!.push(item);
    });
    return Array.from(map.entries());
  }, [sorted]);

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-4 rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-lg shadow-zinc-200/40 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/60 dark:shadow-black/20">
        <div className="grid gap-3 lg:grid-cols-2 lg:items-center lg:gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <span>جستجو</span>
            <input
              type="search"
              placeholder="عنوان، شهر یا برچسب..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-base text-zinc-900 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <span>نوع آزمون</span>
            <select
              value={sectionFilter}
              onChange={(event) => setSectionFilter(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-base text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/40"
            >
              <option value="all">همه</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={onlyWithAnswer}
              onChange={(event) => setOnlyWithAnswer(event.target.checked)}
              className="h-5 w-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800"
            />
            فقط نمونه سوال‌های دارای پاسخ
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <span>مرتب‌سازی</span>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value as SortOption)}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-base text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/40"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {intlNumber.format(sorted.length)} مورد از{" "}
          {intlNumber.format(entries.length)} نمونه سوال
        </p>
      </section>

      <section className="space-y-10">
        {sorted.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-white/70 p-8 text-center text-zinc-600 dark:border-emerald-900/40 dark:bg-zinc-900/40 dark:text-zinc-400">
            موردی با شرایط جستجو و فیلترهای فعلی پیدا نشد. فیلترها را تغییر دهید.
          </div>
        ) : (
          grouped.map(([sectionName, items]) => (
            <div key={sectionName} className="space-y-4">
              <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  {sectionName}
                </h2>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {intlNumber.format(items.length)} نمونه سوال
                </span>
              </header>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm shadow-emerald-100 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-200/40 dark:border-zinc-700 dark:bg-zinc-900/70 dark:shadow-black/30"
                  >
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold leading-7 text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {item.dateLabel && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {item.dateLabel}
                          </span>
                        )}
                        {typeof item.downloadCount === "number" && (
                          <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
                            دانلود: {intlNumber.format(item.downloadCount)}
                          </span>
                        )}
                        {item.city && (
                          <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200">
                            {item.city}
                          </span>
                        )}
                        {item.schoolType && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                            {item.schoolType}
                          </span>
                        )}
                        {item.hasAnswer && (
                          <span className="rounded-full bg-lime-100 px-3 py-1 text-lime-800 dark:bg-lime-900/30 dark:text-lime-200">
                            دارای پاسخ
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, index) => (
                            <span
                              key={`${item.id}-tag-${index}`}
                              className="rounded-full border border-zinc-200 px-2 py-1 dark:border-zinc-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus:ring-offset-zinc-900"
                      >
                        دانلود مستقیم
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
