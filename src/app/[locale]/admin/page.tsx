import AdminProjectList from "../../../components/AdminProjectList";
import { getDb } from "../../../database";
import { NextPage } from "next";

// تایپ‌ها رو از Next.js می‌گیریم
interface Params {
  locale: string;
}

const AdminPage: NextPage<{ params: Params }> = async ({ params }) => {
  const { locale } = params;
  console.log("Server Rendering /fa/admin with locale:", locale);

  const db = await getDb();
  const projects = await db.all("SELECT * FROM projects");
  const portfolio = await db.all("SELECT * FROM portfolio");

  return (
    <div>
      <AdminProjectList locale={locale} initialProjects={projects} initialPortfolio={portfolio} />
    </div>
  );
};

export default AdminPage;