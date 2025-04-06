"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  locale: string;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    console.log("Login response status:", response.status); // دیباگ
    if (response.ok) {
      const { token } = await response.json();
      console.log("Received token:", token); // دیباگ
      router.push(`/${locale}/admin`);
    } else {
      alert(locale === "fa" ? "نام کاربری یا رمز اشتباه است" : "Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">
        {locale === "fa" ? "ورود به پنل مدیر" : "Login to Admin Panel"}
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={locale === "fa" ? "نام کاربری" : "Username"}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={locale === "fa" ? "رمز عبور" : "Password"}
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          {locale === "fa" ? "ورود" : "Login"}
        </button>
      </form>
    </div>
  );
}