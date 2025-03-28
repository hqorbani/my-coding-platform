import { getTranslations } from "../../../lib/getTranslations";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import { getDb } from "../../../database";

interface PageParams {
  locale: string;
}

export default async function Projects({ params }: { params: PageParams }) {
  const awaitedParams = await params;
  const { locale } = awaitedParams;
  const t = getTranslations(locale).projects || {
    title: locale === "fa" ? "پروژه‌های ثبت‌شده" : "Registered Projects",
  };

  const db = await getDb();
  const projects = await db.all("SELECT * FROM projects");

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <LanguageSwitcher />
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <ul className="w-full max-w-md">
        {projects.map((project: any) => (
          <li key={project.id} className="mb-4 p-4 border rounded">
            <p>
              <strong>{locale === "fa" ? "نام پروژه" : "Project Name"}:</strong> {project.projectName}
            </p>
            <p>
              <strong>{locale === "fa" ? "نوع پروژه" : "Project Type"}:</strong> {project.projectType}
            </p>
            <p>
              <strong>{locale === "fa" ? "زبان" : "Locale"}:</strong> {project.locale}
            </p>
            <p>
              <strong>{locale === "fa" ? "زمان ثبت" : "Timestamp"}:</strong> {project.timestamp}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}