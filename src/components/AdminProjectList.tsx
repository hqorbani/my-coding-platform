"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Project {
  id: number;
  projectName: string;
  description: string | null;
  files: string; // JSON string
  projectType: string;
  locale: string;
  timestamp: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  projectType: string;
  files?: string; // JSON string
  timestamp: string;
}

interface AdminProjectListProps {
  locale: string;
  initialProjects: Project[];
  initialPortfolio: PortfolioItem[];
}

export default function AdminProjectList({ locale, initialProjects, initialPortfolio }: AdminProjectListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ projectName: "", projectType: "", title: "", description: "" });
  const [newPortfolio, setNewPortfolio] = useState({ title: "", description: "", projectType: "", files: null as FileList | null });
  const router = useRouter();

  const handleEditProject = (project: Project) => {
    setEditingId(project.id);
    setEditForm({ projectName: project.projectName, projectType: project.projectType, title: "", description: project.description || "" });
  };

  const handleSaveProject = async (id: number) => {
    const token = localStorage.getItem("jwt_token");
    const response = await fetch("/api/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id, projectName: editForm.projectName, projectType: editForm.projectType, description: editForm.description }),
    });

    if (response.ok) {
      setProjects(
        projects.map((project) =>
          project.id === id ? { ...project, projectName: editForm.projectName, projectType: editForm.projectType, description: editForm.description } : project
        )
      );
      setEditingId(null);
    }
  };

  const handleDeleteProject = async (id: number) => {
    const confirmMessage = locale === "fa" ? "آیا مطمئن هستید که می‌خواهید این سفارش را حذف کنید؟" : "Are you sure you want to delete this order?";
    if (window.confirm(confirmMessage)) {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setProjects(projects.filter((project) => project.id !== id));
      }
    }
  };

  const handleDownload = async (file: string) => {
    const token = localStorage.getItem("jwt_token");
    const response = await fetch(`/api/download?file=${encodeURIComponent(file)}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.split('/').pop() || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      alert(locale === "fa" ? "خطا در دانلود فایل" : "Error downloading file");
    }
  };

  const handleEditPortfolio = (item: PortfolioItem) => {
    setEditingId(item.id);
    setEditForm({ projectName: "", projectType: item.projectType, title: item.title, description: item.description || "" });
  };

  const handleSavePortfolio = async (id: number) => {
    const token = localStorage.getItem("jwt_token");
    const response = await fetch("/api/portfolio/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id, title: editForm.title, description: editForm.description, projectType: editForm.projectType }),
    });

    if (response.ok) {
      setPortfolio(
        portfolio.map((item) =>
          item.id === id ? { ...item, title: editForm.title, description: editForm.description, projectType: editForm.projectType } : item
        )
      );
      setEditingId(null);
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    const confirmMessage = locale === "fa" ? "آیا مطمئن هستید که می‌خواهید این نمونه‌کار را حذف کنید؟" : "Are you sure you want to delete this portfolio item?";
    if (window.confirm(confirmMessage)) {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch("/api/portfolio/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setPortfolio(portfolio.filter((item) => item.id !== id));
      }
    }
  };

  const handleAddPortfolio = async () => {
    const token = localStorage.getItem("jwt_token");
    const formData = new FormData();
    formData.append("title", newPortfolio.title);
    formData.append("description", newPortfolio.description);
    formData.append("projectType", newPortfolio.projectType);
    formData.append("timestamp", new Date().toISOString());
    if (newPortfolio.files) {
      Array.from(newPortfolio.files).forEach((file) => formData.append("files", file));
    }

    const response = await fetch("/api/portfolio/add", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const newItem = await response.json();
      console.log("New portfolio item:", newItem);
      newItem.files = JSON.stringify(newItem.files); // مطمئن می‌شیم files یه رشته JSON باشه
      setPortfolio([...portfolio, newItem]);
      setNewPortfolio({ title: "", description: "", projectType: "", files: null });
    } else {
      console.log("Error adding portfolio:", await response.text());
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("jwt_token");
    router.push(`/${locale}/login`);
  };

  const getFileName = (filePath: string) => {
    return filePath.split('/').pop() || filePath;
  };

  return (
    <div className="p-4">
      <button onClick={handleLogout} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
        {locale === "fa" ? "خروج" : "Logout"}
      </button>

      <h2 className="text-2xl mb-4">{locale === "fa" ? "سفارش‌ها" : "Orders"}</h2>
      <ul className="w-full max-w-lg mb-8">
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
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                  rows={4}
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
                <button onClick={() => handleSaveProject(project.id)} className="px-3 py-1 bg-green-600 text-white rounded mr-2">
                  {locale === "fa" ? "ذخیره" : "Save"}
                </button>
                <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-600 text-white rounded">
                  {locale === "fa" ? "لغو" : "Cancel"}
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p><strong>{locale === "fa" ? "نام پروژه" : "Project Name"}:</strong> {project.projectName}</p>
                  <p><strong>{locale === "fa" ? "توضیحات" : "Description"}:</strong> {project.description || "-"}</p>
                  <div>
                    <strong>{locale === "fa" ? "فایل‌ها" : "Files"}:</strong>
                    {JSON.parse(project.files || "[]").length > 0 ? (
                      <ul className="mt-2">
                        {JSON.parse(project.files).map((file: string, index: number) => (
                          <li key={index}>
                            <button onClick={() => handleDownload(file)} className="text-blue-600 underline">
                              {getFileName(file)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span> -</span>
                    )}
                  </div>
                  <p><strong>{locale === "fa" ? "نوع پروژه" : "Project Type"}:</strong> {project.projectType}</p>
                  <p><strong>{locale === "fa" ? "زمان ثبت" : "Timestamp"}:</strong> {project.timestamp}</p>
                </div>
                <div>
                  <button onClick={() => handleEditProject(project)} className="px-3 py-1 bg-yellow-600 text-white rounded mr-2">
                    {locale === "fa" ? "ویرایش" : "Edit"}
                  </button>
                  <button onClick={() => handleDeleteProject(project.id)} className="px-3 py-1 bg-red-600 text-white rounded">
                    {locale === "fa" ? "حذف" : "Delete"}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl mb-4">{locale === "fa" ? "نمونه‌کارها" : "Portfolio"}</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder={locale === "fa" ? "عنوان" : "Title"}
          value={newPortfolio.title}
          onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder={locale === "fa" ? "توضیحات" : "Description"}
          value={newPortfolio.description}
          onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <select
          value={newPortfolio.projectType}
          onChange={(e) => setNewPortfolio({ ...newPortfolio, projectType: e.target.value })}
          className="p-2 border rounded mr-2"
        >
          <option value="">{locale === "fa" ? "نوع پروژه" : "Project Type"}</option>
          <option value="website">{locale === "fa" ? "وبسایت" : "Website"}</option>
          <option value="trading-bot">{locale === "fa" ? "ربات معاملاتی" : "Trading Bot"}</option>
          <option value="desktop">{locale === "fa" ? "نرم‌افزار دسکتاپ" : "Desktop Software"}</option>
        </select>
        <input
          type="file"
          multiple
          onChange={(e) => setNewPortfolio({ ...newPortfolio, files: e.target.files })}
          className="p-2 border rounded mr-2"
        />
        <button onClick={handleAddPortfolio} className="px-4 py-2 bg-green-600 text-white rounded">
          {locale === "fa" ? "اضافه کردن" : "Add"}
        </button>
      </div>

      <ul className="w-full max-w-lg">
        {portfolio.map((item) => (
          <li key={item.id} className="mb-4 p-4 border rounded flex justify-between items-center">
            {editingId === item.id ? (
              <div className="w-full">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
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
                <button onClick={() => handleSavePortfolio(item.id)} className="px-3 py-1 bg-green-600 text-white rounded mr-2">
                  {locale === "fa" ? "ذخیره" : "Save"}
                </button>
                <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-600 text-white rounded">
                  {locale === "fa" ? "لغو" : "Cancel"}
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p><strong>{locale === "fa" ? "عنوان" : "Title"}:</strong> {item.title}</p>
                  <p><strong>{locale === "fa" ? "توضیحات" : "Description"}:</strong> {item.description || "-"}</p>
                  <p><strong>{locale === "fa" ? "نوع پروژه" : "Project Type"}:</strong> {item.projectType}</p>
                  <p><strong>{locale === "fa" ? "زمان ثبت" : "Timestamp"}:</strong> {item.timestamp}</p>
                  {item.files && (
  <div className="mt-2">
    <strong>{locale === "fa" ? "تصاویر" : "Images"}:</strong>
    <div className="flex flex-wrap gap-2">
      {(() => {
        try {
          const files = typeof item.files === "string" ? JSON.parse(item.files) : item.files;
          console.log("Files for item", item.id, ":", files);
          return files.map((file: string, index: number) => {
            const fileName = file.split("/uploads/")[1]; // فقط نام فایل
            const src = `/api/static/uploads/${fileName}`;
            console.log("Rendering image with src:", src);
            return (
              <Image
                key={index}
                src={src}
                alt={`${item.title} image ${index + 1}`}
                width={100}
                height={100}
                className="object-cover rounded"
              />
            );
          });
        } catch (e) {
          console.error("Error parsing files:", e, "Files value:", item.files);
          return <span>خطا در بارگذاری تصاویر</span>;
        }
      })()}
    </div>
  </div>
)}
                </div>
                <div>
                  <button onClick={() => handleEditPortfolio(item)} className="px-3 py-1 bg-yellow-600 text-white rounded mr-2">
                    {locale === "fa" ? "ویرایش" : "Edit"}
                  </button>
                  <button onClick={() => handleDeletePortfolio(item.id)} className="px-3 py-1 bg-red-600 text-white rounded">
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