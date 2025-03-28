"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // برای ریدایرکت

interface Project {
  id: number;
  projectName: string;
  projectType: string;
  locale: string;
  timestamp: string;
}

interface AdminProjectListProps {
  locale: string;
  initialProjects: Project[];
}

export default function AdminProjectList({ locale, initialProjects }: AdminProjectListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ projectName: "", projectType: "" });
  const router = useRouter();

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setEditForm({ projectName: project.projectName, projectType: project.projectType });
  };

  const handleSave = async (id: number) => {
    const response = await fetch("/api/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editForm }),
    });

    if (response.ok) {
      setProjects(
        projects.map((project) =>
          project.id === id ? { ...project, ...editForm } : project
        )
      );
      setEditingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (response.ok) {
      router.push(`/${locale}/login`); // ریدایرکت به صفحه لاگین
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {locale === "fa" ? "خروج" : "Logout"}
      </button>
      <ul className="w-full max-w-lg">
        {projects.map((project) => (
          <li key={project.id} className="mb-4 p-4 border rounded flex justify-between items-center">
            {editingId === project.id ? (
              <div className="w-full">
                <input
                  type="text"
                  value={editForm.projectName}
                  onChange={(e) => setEditForm({ ...editForm, projectName: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                />
                <select
                  value={editForm.projectType}
                  onChange={(e) => setEditForm({ ...editForm, projectType: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="website">{locale === "fa" ? "وبسایت" : "Website"}</option>
                  <option value="trading-bot">{locale === "fa" ? "ربات معاملاتی" : "Trading Bot"}</option>
                  <option value="desktop">{locale === "fa" ? "نرم‌افزار دسکتاپ" : "Desktop Software"}</option>
                </select>
                <button
                  onClick={() => handleSave(project.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded mr-2"
                >
                  {locale === "fa" ? "ذخیره" : "Save"}
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 bg-gray-600 text-white rounded"
                >
                  {locale === "fa" ? "لغو" : "Cancel"}
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p>
                    <strong>{locale === "fa" ? "نام پروژه" : "Project Name"}:</strong> {project.projectName}
                  </p>
                  <p>
                    <strong>{locale === "fa" ? "نوع پروژه" : "Project Type"}:</strong> {project.projectType}
                  </p>
                  <p>
                    <strong>{locale === "fa" ? "زمان ثبت" : "Timestamp"}:</strong> {project.timestamp}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(project)}
                    className="px-3 py-1 bg-yellow-600 text-white rounded mr-2"
                  >
                    {locale === "fa" ? "ویرایش" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    {locale === "fa" ? "حذف" : "Delete"}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}