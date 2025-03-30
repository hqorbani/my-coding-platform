"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

type PortfolioItem = {
  id: number;
  title: string;
  description?: string;
  projectType: string;
  timestamp: string;
};

export default function PortfolioPage() {
  const params = useParams();
  const locale = params?.locale as string;
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      // اینجا می‌تونی از API یا دیتابیس بگیری
      const response = await fetch(`/${locale}/api/portfolio`);
      const data: PortfolioItem[] = await response.json();
      setItems(data);
    };
    fetchPortfolio();
  }, [locale]);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}