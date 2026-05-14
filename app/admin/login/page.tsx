"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@maijin.cn");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("邮箱或密码错误");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded bg-[#D4A843] flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">迈</span>
          </div>
          <h1 className="text-xl font-semibold">管理后台登录</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">邮箱</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">密码</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-[#D4A843] text-white rounded-lg py-2.5 font-medium hover:bg-[#c49a3a]">
            登录
          </button>
        </form>
      </div>
    </div>
  );
}
