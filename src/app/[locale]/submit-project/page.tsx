import { getTranslations } from "../../../lib/getTranslations";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import ProjectForm from "../../../components/ProjectForm";

// تایپ برای params
type Params = {
  locale: string;
};

export default async function SubmitProject({ params }: { params: Promise<Params> }) {
  const { locale } = await params; // مستقیم await می‌کنیم
  const t = getTranslations(locale).submitProject || {
    title: locale === "fa" ? "ثبت پروژه جدید" : "Submit a New Project",
    submitButton: locale === "fa" ? "ارسال" : "Submit",
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <LanguageSwitcher />
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <ProjectForm locale={locale} t={t} />
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}