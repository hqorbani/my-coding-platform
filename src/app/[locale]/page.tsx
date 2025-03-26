import { getTranslations } from "../../lib/getTranslations";
import LanguageSwitcher from "../components/LanguageSwitcher";

interface PageParams {
  locale: string;
}

export default async function Home({ params }: { params: PageParams }) {
  const awaitedParams = await params;
  const { locale } = awaitedParams;
  const t = getTranslations(locale).home;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LanguageSwitcher />
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p className="mt-4 text-lg">{t.description}</p>
      <a href={`/${locale}/submit-project`} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">
        {t.submitLink}
      </a>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}