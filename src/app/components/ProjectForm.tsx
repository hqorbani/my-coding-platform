"use client";

import { FormEvent, useState } from "react";

interface ProjectFormProps {
  locale: string;
  t: {
    title: string;
    submitButton: string;
  };
}

export default function ProjectForm({ locale, t }: ProjectFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "website", // مقدار پیش‌فرض
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, locale }),
    });

    const result = await response.json();
    console.log("API Response:", result);

    setMessage(locale === "fa" ? "پروژه با موفقیت ثبت شد!" : "Project submitted successfully!");
    setFormData({ projectName: "", projectType: "website" }); // فرم رو ریست می‌کنه
  };

  return (
    <div>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-lg mb-2" htmlFor="projectName">
            {locale === "fa" ? "نام پروژه" : "Project Name"}
          </label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            className="w-full p-2 border rounded"
            placeholder={locale === "fa" ? "نام پروژه را وارد کنید" : "Enter project name"}
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2" htmlFor="projectType">
            {locale === "fa" ? "نوع پروژه" : "Project Type"}
          </label>
          <select
            id="projectType"
            name="projectType"
            className="w-full p-2 border rounded"
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
          >
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