import AdminProjectList from "../../../components/AdminProjectList";
import { getDb } from "../../../database";

// تایپ برای params
type Params = {
  locale: string;
};

// صفحه سرور-ساید با params به صورت Promise
export default async function AdminPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params; // await کردن params
  console.log("Server Rendering /fa/admin with locale:", locale);

  const db = await getDb();
  const projects = await db.all("SELECT * FROM projects");
  const portfolio = await db.all("SELECT * FROM portfolio");

  return (
    <div>
      <AdminProjectList
        locale={locale}
        initialProjects={projects}
        initialPortfolio={portfolio}
      />
    </div>
  );
}