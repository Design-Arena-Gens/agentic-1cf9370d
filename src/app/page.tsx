import { ExamExplorer } from "@/components/ExamExplorer";
import { fetchBiologyExamResources } from "@/lib/fetchBiologyQuestions";

export default async function Home() {
  const resources = await fetchBiologyExamResources();
  const totalWithAnswer = resources.filter((item) => item.hasAnswer).length;
  const sections = Array.from(new Set(resources.map((item) => item.section)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-4 py-12 font-sans dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 sm:px-6 lg:px-12">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="space-y-6 rounded-3xl border border-emerald-100 bg-white/95 p-10 text-center shadow-xl shadow-emerald-100/40 backdrop-blur dark:border-emerald-900/40 dark:bg-zinc-900/80 dark:text-zinc-100 dark:shadow-black/40 sm:text-right">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
            بانک جامع نمونه سوالات
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
            دانلود مستقیم تمام نمونه سوالات زیست شناسی دوازدهم تجربی
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            آخرین مجموعه از نمونه سوالات امتحانی زیست ۳ پایه دوازدهم تجربی
            منتشر شده در وب‌سایت قلم‌چی به همراه اطلاعات تکمیلی، نوع آزمون،
            شهر، نوع مدرسه و وضعیت پاسخنامه.
          </p>
          <dl className="mx-auto grid max-w-3xl grid-cols-1 gap-4 rounded-2xl bg-emerald-50/80 p-6 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 sm:grid-cols-3">
            <div className="space-y-1">
              <dt className="font-medium text-emerald-600 dark:text-emerald-300">
                تعداد کل نمونه سوالات
              </dt>
              <dd className="text-2xl font-bold">
                {new Intl.NumberFormat("fa-IR").format(resources.length)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-medium text-emerald-600 dark:text-emerald-300">
                نمونه سوال‌های دارای پاسخ
              </dt>
              <dd className="text-2xl font-bold">
                {new Intl.NumberFormat("fa-IR").format(totalWithAnswer)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-medium text-emerald-600 dark:text-emerald-300">
                تنوع انواع آزمون
              </dt>
              <dd className="text-2xl font-bold">
                {new Intl.NumberFormat("fa-IR").format(sections.length)}
              </dd>
            </div>
          </dl>
        </header>
        <ExamExplorer entries={resources} />
      </main>
    </div>
  );
}
