"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { LayoutDashboard, FolderOpen, FileText, MessageSquare, Settings, LogOut } from "lucide-react";

const adminNav = [
  { href: "/admin", icon: LayoutDashboard, label: "仪表盘" },
  { href: "/admin/projects", icon: FolderOpen, label: "项目管理" },
  { href: "/admin/news", icon: FileText, label: "新闻管理" },
  { href: "/admin/messages", icon: MessageSquare, label: "留言管理" },
  { href: "/admin/settings", icon: Settings, label: "站点设置" },
];

function AdminContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex">
      <aside className="w-56 bg-white border-r shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#D4A843] flex items-center justify-center">
              <span className="text-white font-bold text-xs">迈</span>
            </div>
            <span className="text-sm font-semibold">管理后台</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminNav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                pathname === n.href ? "bg-[#D4A843]/10 text-[#D4A843]" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <n.icon size={16} />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t">
          <Link href="/admin/account" className="flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-50">
            <Settings size={16} /> 账号管理
          </Link>
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-50 mt-1">
            <LogOut size={16} /> 退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">加载中...</div>}>
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}

function signOut() {
  fetch("/api/auth/signout", { method: "POST" }).then(() => { window.location.href = "/admin/login"; });
}
