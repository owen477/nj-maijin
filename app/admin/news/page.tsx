"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Star, X, Upload, Eye, EyeOff } from "lucide-react";

interface Article {
  id: number;
  title: string;
  content: string;
  cover?: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Article | null>(null);
  const [form, setForm] = useState({ title: "", content: "", cover: "", published: true, featured: false });
  const [uploading, setUploading] = useState(false);

  const load = () => fetch("/api/articles?admin=true").then((r) => r.json()).then(setArticles);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditItem(null); setForm({ title: "", content: "", cover: "", published: true, featured: false }); setShowModal(true); };
  const openEdit = (a: Article) => { setEditItem(a); setForm({ title: a.title, content: a.content, cover: a.cover || "", published: a.published, featured: a.featured }); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? `/api/articles/${editItem.id}` : "/api/articles";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowModal(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除？")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
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
    if (data.url) setForm({ ...form, cover: data.url });
    setUploading(false);
  };

  const toggleFeatured = async (a: Article) => {
    await fetch(`/api/articles/${a.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...a, featured: !a.featured }) });
    load();
  };

  const togglePublished = async (a: Article) => {
    await fetch(`/api/articles/${a.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...a, published: !a.published }) });
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">新闻管理</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#D4A843] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#c49a3a]">
          <Plus size={16} /> 新增新闻
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F7F7F7]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">标题</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">封面</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">置顶</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">发布</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">日期</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3">
                  {a.cover ? <img src={a.cover} className="w-12 h-8 object-cover rounded" /> : <span className="text-gray-400">无</span>}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleFeatured(a)} className={`p-1 rounded ${a.featured ? "text-yellow-500" : "text-gray-300"}`}>
                    <Star size={18} fill={a.featured ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => togglePublished(a)} className={`p-1 rounded ${a.published ? "text-green-500" : "text-gray-300"}`}>
                    {a.published ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-600">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(a)} className="p-1.5 text-gray-500 hover:text-[#D4A843] rounded"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 text-gray-500 hover:text-red-500 rounded ml-1"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">暂无数据</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">{editItem ? "编辑新闻" : "新增新闻"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">标题 *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">封面图</label>
                {form.cover && <img src={form.cover} className="w-32 h-20 object-cover rounded mb-2" />}
                <label className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-200">
                  <Upload size={14} /> {uploading ? "上传中..." : "上传封面"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">内容 *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={10} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 font-mono" />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                  <label htmlFor="featured" className="text-sm text-gray-600">置顶</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" />
                  <label htmlFor="published" className="text-sm text-gray-600">发布</label>
                </div>
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
