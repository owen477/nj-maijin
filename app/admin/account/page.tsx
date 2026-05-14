"use client";
import { useState, useEffect, Suspense } from "react";
import { Plus, Pencil, Trash2, X, Shield } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
}

function AccountContent() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "admin" });
  const [msg, setMsg] = useState("");

  const load = () => fetch("/api/users").then((r) => r.json()).then(setUsers);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditItem(null); setForm({ email: "", name: "", password: "", role: "admin" }); setMsg(""); setShowModal(true); };
  const openEdit = (u: User) => { setEditItem(u); setForm({ email: u.email, name: u.name || "", password: "", role: u.role }); setMsg(""); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem && !form.password) { setMsg("密码不能为空"); return; }
    const body: Record<string, string> = { email: form.email, name: form.name, role: form.role };
    if (form.password) body.password = form.password;
    const res = await fetch(editItem ? `/api/users/${editItem.id}` : "/api/users", {
      method: editItem ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setShowModal(false); load(); }
    else { const d = await res.json(); setMsg(d.error || "操作失败"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除该账号？")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    load();
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const old = fd.get("oldPassword") as string;
    const neo = fd.get("newPassword") as string;
    const con = fd.get("confirmPassword") as string;
    if (neo !== con) { setMsg("两次密码不一致"); return; }
    const res = await fetch("/api/users/me/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ oldPassword: old, newPassword: neo }) });
    if (res.ok) { setMsg("密码修改成功"); (e.target as HTMLFormElement).reset(); }
    else { const d = await res.json(); setMsg(d.error || "修改失败"); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">账号管理</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#D4A843] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#c49a3a]">
          <Plus size={16} /> 新增账号
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-[#F7F7F7]">
            <h2 className="font-semibold">用户列表</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F7F7]">
                <th className="text-left px-4 py-3 font-medium text-gray-600">账号</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">角色</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-gray-400" />
                      <span>{u.email}</span>
                    </div>
                    {u.name && <p className="text-xs text-gray-400">{u.name}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.role === "admin" ? "管理员" : "编辑"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(u)} className="p-1.5 text-gray-500 hover:text-[#D4A843] rounded"><Pencil size={16} /></button>
                    {u.id !== Number((session?.user as { id?: string })?.id) && (
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 text-gray-500 hover:text-red-500 rounded ml-1"><Trash2 size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4">修改密码</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">当前密码</label>
              <input type="password" name="oldPassword" required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">新密码</label>
              <input type="password" name="newPassword" required minLength={6} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">确认密码</label>
              <input type="password" name="confirmPassword" required minLength={6} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
            </div>
            {msg && <p className="text-sm text-red-500">{msg}</p>}
            <button type="submit" className="w-full bg-[#D4A843] text-white rounded-lg py-2 text-sm hover:bg-[#c49a3a]">确认修改</button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">{editItem ? "编辑账号" : "新增账号"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">邮箱 *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">姓名</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">{editItem ? "新密码（留空则不变）" : "密码 *"}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editItem} minLength={6} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">角色</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30">
                  <option value="admin">管理员</option>
                  <option value="editor">编辑</option>
                </select>
              </div>
              {msg && <p className="text-sm text-red-500">{msg}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">取消</button>
                <button type="submit" className="px-4 py-2 bg-[#D4A843] text-white rounded-lg text-sm hover:bg-[#c49a3a]">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400">加载中...</div>}>
      <AccountContent />
    </Suspense>
  );
}
