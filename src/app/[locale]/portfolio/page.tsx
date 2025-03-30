"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import Image from "next/image";

type PortfolioItem = {
  id: number;
  title: string;
  description?: string;
  projectType: string;
  files?: string; // JSON string
  timestamp: string;
};

export default function PortfolioPage() {
  const params = useParams();
  const locale = params?.locale as string;
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const response = await fetch(`/api/portfolio/all`);
      const data = await response.json();
      setPortfolioItems(data);
    };
    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <LanguageSwitcher />
      <h1 className="text-3xl font-bold mb-6">
        {locale === "fa" ? "نمونه‌کارها" : "Portfolio"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{item.title}</h2>
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
        ))}
      </div>
    </div>
  );
}