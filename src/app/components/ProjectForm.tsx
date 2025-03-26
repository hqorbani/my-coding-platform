"use client";

import { FormEvent } from "react";

interface ProjectFormProps {
  locale: string;
  t: {
    title: string;
    submitButton: string;
  };
}

export default function ProjectForm({ locale, t }: ProjectFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectName = formData.get("projectName") as string;
    const projectType = formData.get("projectType") as string;
    console.log("Project Submitted:", { projectName, projectType, locale });
  };

  return (
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
  );
}