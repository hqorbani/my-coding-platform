"use client"; // چون کلاینت‌سایده

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/en") ? "en" : "fa";
  const switchTo = currentLocale === "fa" ? "en" : "fa";
  const basePath = pathname.replace(/^\/(fa|en)/, "");
  const newPath = `/${switchTo}${basePath}`;

  return (
    <div className="p-4">
      <Link href={newPath} className="text-blue-600 hover:underline">
        {switchTo === "en" ? "English" : "فارسی"}
      </Link>
    </div>
  );
}