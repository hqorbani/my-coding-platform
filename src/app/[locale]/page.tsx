"use client"; // این خط باعث می‌شه JSX تو کلاینت کار کنه

import Link from "next/link";
import { useParams } from "next/navigation"; // برای گرفتن locale تو کلاینت

export default function HomePage() {
  const params = useParams(); // params رو تو کلاینت می‌گیریم
  const locale = params?.locale as string; // نوع رو صریح می‌کنیم

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {locale === "fa" ? "خوش آمدید به پلتفرم برنامه‌نویسی" : "Welcome to My Coding Platform"}
      </h1>
      <p className="mb-4">
        {locale === "fa" ? "اینجا می‌تونید پروژه‌هاتون رو مدیریت کنید." : "Here you can manage your coding projects."}
      </p>
      <div className="space-x-4">
        <Link href={`/${locale}/login`} className="text-blue-500 hover:underline">
          {locale === "fa" ? "ورود" : "Login"}
        </Link>
        <Link href={`/${locale}/admin`} className="text-blue-500 hover:underline">
          {locale === "fa" ? "پنل ادمین" : "Admin Panel"}
        </Link>
      </div>
    </div>
  );
}