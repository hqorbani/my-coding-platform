import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "../../../database";
import AdminProjectList from "../../../components/AdminProjectList";

// تابع async برای گرفتن locale
export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  // await کردن params
  const { locale } = await params;

  // گرفتن کوکی‌ها
  const cookieStore = await cookies(); // await کردن cookies
  const authCookie = cookieStore.get("admin-auth");

  if (!authCookie || authCookie.value !== "supersecretpassword") {
    redirect(`/${locale}/login`);
  }

  const db = await getDb();
  const projects = await db.all("SELECT * FROM projects");
  const portfolio = await db.all("SELECT * FROM portfolio");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">
        {locale === "fa" ? "پنل مدیریت" : "Admin Panel"}
      </h1>
      <AdminProjectList locale={locale} initialProjects={projects} initialPortfolio={portfolio} />
    </div>
  );
}