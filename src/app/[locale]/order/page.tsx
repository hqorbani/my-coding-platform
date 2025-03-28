"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function OrderPage() {
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    projectType: "",
    files: [] as File[],
  });
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string; // مستقیم از useParams می‌گیریم

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("projectName", form.projectName);
    formData.append("description", form.description);
    formData.append("projectType", form.projectType);
    formData.append("locale", locale);
    formData.append("timestamp", new Date().toISOString());
    form.files.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/order", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert(locale === "fa" ? "سفارش با موفقیت ثبت شد" : "Order submitted successfully");
      router.push(`/${locale}`);
    } else {
      alert(locale === "fa" ? "خطا در ثبت سفارش" : "Error submitting order");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">
        {locale === "fa" ? "ثبت سفارش" : "Submit Order"}
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-4">
          <label className="block mb-2">{locale === "fa" ? "نام پروژه" : "Project Name"}</label>
          <input
            type="text"
            value={form.projectName}
            onChange={(e) => setForm({ ...form, projectName: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">{locale === "fa" ? "توضیحات" : "Description"}</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">{locale === "fa" ? "نوع پروژه" : "Project Type"}</label>
          <select
            value={form.projectType}
            onChange={(e) => setForm({ ...form, projectType: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">{locale === "fa" ? "انتخاب کنید" : "Select"}</option>
            <option value="website">{locale === "fa" ? "وبسایت" : "Website"}</option>
            <option value="trading-bot">{locale === "fa" ? "ربات معاملاتی" : "Trading Bot"}</option>
            <option value="desktop">{locale === "fa" ? "نرم‌افزار دسکتاپ" : "Desktop Software"}</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">{locale === "fa" ? "فایل‌ها" : "Files"}</label>
          <input
            type="file"
            multiple
            onChange={(e) => setForm({ ...form, files: Array.from(e.target.files || []) })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {locale === "fa" ? "ارسال" : "Submit"}
        </button>
      </form>
    </div>
  );
}