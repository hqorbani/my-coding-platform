"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

type ProjectItem = {
  id: number;
  projectName: string;
  description?: string;
  files?: string;
  projectType: string;
  locale: string;
  timestamp: string;
};

export default function ProjectsPage() {
  const params = useParams();
  const locale = params?.locale as string;
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(`/${locale}/api/projects`);
      const data: ProjectItem[] = await response.json();
      setProjects(data);
    };
    fetchProjects();
  }, [locale]);

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>{project.projectName}</div>
      ))}
    </div>
  );
}