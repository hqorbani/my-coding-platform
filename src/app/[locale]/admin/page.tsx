import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminProjectList from "../../components/AdminProjectList";
import { getDb } from "../../../database";

interface PageParams {
  locale: string;
}

export default async function AdminPage({ params }: { params: PageParams }) {
  const awaitedParams = await params;
  const { locale } = awaitedParams;

  // await کردن cookies
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin-auth");

  if (!authCookie || authCookie.value !== "supersecretpassword") {
    redirect(`/${locale}/login`);
  }

  const db = await getDb();
  const projects = await db.all("SELECT * FROM projects WHERE locale = ?", [locale]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">
        {locale === "fa" ? "پنل مدیریت پروژه‌ها" : "Admin Project Panel"}
      </h1>
      <AdminProjectList locale={locale} initialProjects={projects} />
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}