"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Star, X, Upload } from "lucide-react";

interface Project {
  id: number;
  title: string;
  client: string;
  amount?: string;
  date?: string;
  type: string;
  images: string;
  description?: string;
  sort: number;
  featured: boolean;
  createdAt: string;
}

const TYPES = ["房建", "市政", "装饰"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: "", client: "", amount: "", date: "", type: "房建", images: "[]", description: "", sort: 0, featured: false });
  const [uploading, setUploading] = useState(false);

  const load = () => fetch("/api/projects").then((r) => r.json()).then(setProjects);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditItem(null); setForm({ title: "", client: "", amount: "", date: "", type: "房建", images: "[]", description: "", sort: 0, featured: false }); setShowModal(true); };
  const openEdit = (p: Project) => { setEditItem(p); setForm({ title: p.title, client: p.client, amount: p.amount || "", date: p.date || "", type: p.type, images: p.images, description: p.description || "", sort: p.sort, featured: p.featured }); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? `/api/projects/${editItem.id}` : "/api/projects";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除？")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      const imgs = JSON.parse(form.images);
      imgs.push(data.url);
      setForm({ ...form, images: JSON.stringify(imgs) });
    }
    setUploading(false);
  };

  const removeImage = (i: number) => {
    const imgs = JSON.parse(form.images);
    imgs.splice(i, 1);
    setForm({ ...form, images: JSON.stringify(imgs) });
  };

  const toggleFeatured = async (p: Project) => {
    await fetch(`/api/projects/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, featured: !p.featured }) });
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">项目管理</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#D4A843] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#c49a3a]">
          <Plus size={16} /> 新增项目
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F7F7F7]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">标题</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">客户</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">类型</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">金额</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">排序</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">首页推荐</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-gray-600">{p.client}</td>
                <td className="px-4 py-3 text-gray-600">{p.type}</td>
                <td className="px-4 py-3 text-gray-600">{p.amount || "-"}</td>
                <td className="px-4 py-3 text-gray-600">{p.sort}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleFeatured(p)} className={`p-1 rounded ${p.featured ? "text-yellow-500" : "text-gray-300"}`}>
                    <Star size={18} fill={p.featured ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(p)} className="p-1.5 text-gray-500 hover:text-[#D4A843] rounded"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-500 hover:text-red-500 rounded ml-1"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">暂无数据</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">{editItem ? "编辑项目" : "新增项目"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">项目名称 *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">客户名称 *</label>
                  <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">业务类型</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30">
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">金额（万元）</label>
                  <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">日期</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">排序</label>
                  <input type="number" value={form.sort} onChange={(e) => setForm({ ...form, sort: parseInt(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">描述</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">图片</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {JSON.parse(form.images).map((url: string, i: number) => (
                    <div key={i} className="relative w-20 h-20 rounded border overflow-hidden">
                      <img src={url} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-black/50 text-white p-0.5 rounded-bl"><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <label className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-200">
                  <Upload size={14} /> {uploading ? "上传中..." : "上传图片"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                <label htmlFor="featured" className="text-sm text-gray-600">首页推荐</label>
              </div>
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
