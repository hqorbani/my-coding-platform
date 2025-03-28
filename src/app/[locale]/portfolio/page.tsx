import { getDb } from "../../../database";

export default async function PortfolioPage({ params }: { params: { locale: string } }) {
  const db = await getDb();
  const portfolio = await db.all("SELECT * FROM portfolio");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">
        {params.locale === "fa" ? "نمونه‌کارها" : "Portfolio"}
      </h1>
      <ul className="w-full max-w-lg">
        {portfolio.map((item: any) => (
          <li key={item.id} className="mb-4 p-4 border rounded">
            <p><strong>{params.locale === "fa" ? "عنوان" : "Title"}:</strong> {item.title}</p>
            <p><strong>{params.locale === "fa" ? "توضیحات" : "Description"}:</strong> {item.description || "-"}</p>
            <p><strong>{params.locale === "fa" ? "نوع پروژه" : "Project Type"}:</strong> {item.projectType}</p>
            <p><strong>{params.locale === "fa" ? "زمان ثبت" : "Timestamp"}:</strong> {item.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}