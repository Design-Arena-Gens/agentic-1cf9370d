import * as cheerio from "cheerio";

export type BiologyExamResource = {
  id: string;
  section: string;
  title: string;
  url: string;
  downloadCount: number | null;
  dateLabel: string | null;
  hasAnswer: boolean;
  schoolType: string | null;
  city: string | null;
  tags: string[];
  stateCode: string | null;
  cityCode: string | null;
  schoolCode: string | null;
  answerCode: string | null;
};

const SOURCE_URL =
  "https://www.kanoon.ir/Public/ExamQuestions?group=3&lesson=215";

const BASE_URL = "https://www.kanoon.ir";

const REVALIDATE_SECONDS = 60 * 60 * 6; // 6 hours

export async function fetchBiologyExamResources(): Promise<
  BiologyExamResource[]
> {
  const response = await fetch(SOURCE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7",
    },
    next: {
      revalidate: REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch biology exam resources: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const items: BiologyExamResource[] = [];

  $(".LessonExams").each((_index, sectionEl) => {
    const sectionName = $(sectionEl).find(".LessonType").first().text().trim();

    $(sectionEl)
      .find(".examfile")
      .each((_fileIndex, examEl) => {
        const container = $(examEl);
        const anchor = container.find("a.downloadfile").first();

        if (!anchor.length) {
          return;
        }

        const relativeHref = anchor.attr("href");
        if (!relativeHref) {
          return;
        }

        const title =
          anchor.find("div").first().text().replace(/\s+/g, " ").trim() ||
          anchor.text().replace(/\s+/g, " ").trim();

        const labels = anchor.find("span.label");
        const extraTags: string[] = [];
        let downloadCount: number | null = null;
        let dateLabel: string | null = null;
        let schoolType: string | null = null;
        let city: string | null = null;
        let hasAnswer = false;

        labels.each((_labelIndex, labelEl) => {
          const label = $(labelEl);
          const value = label.text().replace(/\s+/g, " ").trim();
          if (!value) {
            return;
          }

          if (label.hasClass("label-default")) {
            const match = value.replace(/[^\d]/g, "");
            downloadCount =
              match.length > 0 ? parseInt(match, 10) || null : downloadCount;
          } else if (label.hasClass("label-info")) {
            dateLabel = value;
          } else if (label.hasClass("label-success")) {
            if (value.includes("پاسخ")) {
              hasAnswer = true;
            } else if (!schoolType) {
              schoolType = value;
            }
          } else if (label.hasClass("label-warning")) {
            if (!city) {
              city = value;
            }
          } else {
            extraTags.push(value);
          }
        });

        items.push({
          id: container.attr("data-id") ?? "",
          section: sectionName,
          title,
          url: new URL(relativeHref, BASE_URL).toString(),
          downloadCount,
          dateLabel,
          hasAnswer,
          schoolType,
          city,
          tags: extraTags,
          stateCode: container.attr("state") ?? null,
          cityCode: container.attr("city") ?? null,
          schoolCode: container.attr("school") ?? null,
          answerCode: container.attr("answer") ?? null,
        });
      });
  });

  return items;
}
