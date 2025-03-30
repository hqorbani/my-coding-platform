"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

type PortfolioItem = {
  id: number;
  title: string;
  description?: string;
  projectType: string;
  files?: string; // JSON string of file paths
  timestamp: string;
};

export default function PortfolioCard({ item, locale }: { item: PortfolioItem; locale: string }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/${locale}/admin/edit-portfolio?id=${item.id}`);
  };

  const handleDelete = async () => {
    const response = await fetch("/api/portfolio/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    });
    if (response.ok) {
      router.refresh();
    }
  };

  return (
    <div className="border p-4 rounded shadow flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p>{item.description}</p>
        <p>{item.projectType}</p>
        <p>{item.timestamp}</p>
        {item.files && (
          <div className="mt-2 flex flex-wrap gap-2">
            {JSON.parse(item.files).map((filePath: string, index: number) => (
              <Image
                key={index}
                src={filePath}
                alt={`${item.title} image ${index + 1}`}
                width={200}
                height={200}
                className="object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded">
          {locale === "fa" ? "ویرایش" : "Edit"}
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
          {locale === "fa" ? "حذف" : "Delete"}
        </button>
      </div>
    </div>
  );
}