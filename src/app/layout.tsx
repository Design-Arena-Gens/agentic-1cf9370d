import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "نمونه سوالات زیست شناسی دوازدهم تجربی | قلم‌چی",
  description:
    "دسترسی سریع به تمامی لینک‌های دانلود نمونه سوالات زیست شناسی پایه دوازدهم تجربی وب‌سایت قلم‌چی با امکان جستجو و فیلتر پیشرفته.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
