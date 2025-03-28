import LoginForm from "../../../components/LoginForm";

interface PageParams {
  locale: string;
}

export default async function Login({ params }: { params: PageParams }) {
  const awaitedParams = await params;
  const { locale } = awaitedParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div suppressHydrationWarning>
        <LoginForm locale={locale} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}