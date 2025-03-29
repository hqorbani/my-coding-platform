"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { locale } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log("Response status:", response.status, "Data:", data);

    if (response.ok) {
      localStorage.setItem("jwt_token", data.token);
      document.cookie = `jwt_token=${data.token}; path=/; max-age=3600`;
      console.log("Redirecting to /" + locale + "/admin");
      router.push(`/${locale}/admin`);
    } else {
      alert(locale === "fa" ? "نام کاربری یا رمز عبور اشتباه است" : "Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl mb-4">{locale === "fa" ? "ورود" : "Login"}</h1>
        <div className="mb-4">
          <label className="block mb-2">{locale === "fa" ? "نام کاربری" : "Username"}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">{locale === "fa" ? "رمز عبور" : "Password"}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          {locale === "fa" ? "ورود" : "Login"}
        </button>
      </form>
    </div>
  );
}