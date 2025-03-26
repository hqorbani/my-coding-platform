import { getTranslations } from "../../../lib/getTranslations";
import LanguageSwitcher from "../../components/LanguageSwitcher";

interface PageParams {
  locale: string;
}

export default async function SubmitProject({ params }: { params: PageParams }) {
  const awaitedParams = await params;
  const { locale } = awaitedParams;
  const t = getTranslations(locale).submitProject || {
    title: locale === "fa" ? "ثبت پروژه جدید" : "Submit a New Project",
    submitButton: locale === "fa" ? "ارسال" : "Submit",
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <LanguageSwitcher />
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <form className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-lg mb-2" htmlFor="projectName">
            {locale === "fa" ? "نام پروژه" : "Project Name"}
          </label>
          <input
            type="text"
            id="projectName"
            className="w-full p-2 border rounded"
            placeholder={locale === "fa" ? "نام پروژه را وارد کنید" : "Enter project name"}
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2" htmlFor="projectType">
            {locale === "fa" ? "نوع پروژه" : "Project Type"}
          </label>
          <select id="projectType" className="w-full p-2 border rounded">
            <option value="website">{locale === "fa" ? "وبسایت" : "Website"}</option>
            <option value="trading-bot">{locale === "fa" ? "ربات معاملاتی" : "Trading Bot"}</option>
            <option value="desktop">{locale === "fa" ? "نرم‌افزار دسکتاپ" : "Desktop Software"}</option>
          </select>
        </div>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          {t.submitButton}
        </button>
      </form>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}