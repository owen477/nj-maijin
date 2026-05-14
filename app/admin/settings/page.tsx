"use client";
import { useState, useEffect } from "react";
import { Save, Upload } from "lucide-react";

interface Config {
  companyName?: string;
  companyDesc?: string;
  phone?: string;
  email?: string;
  address?: string;
  copyright?: string;
  [key: string]: string | undefined;
}

export default function SettingsPage() {
  const [form, setForm] = useState<Config>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/config").then((r) => r.json()).then((data) => {
      const obj: Config = {};
      data.forEach((d: { key: string; value: string }) => { obj[d.key] = d.value; });
      setForm(obj);
    });
  }, []);

  const handleSave = async () => {
    await Promise.all(
      Object.entries(form).map(([key, value]) =>
        fetch("/api/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        })
      )
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(key);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setForm({ ...form, [key]: data.url });
    setUploading(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">站点设置</h1>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${saved ? "bg-green-500 text-white" : "bg-[#D4A843] text-white hover:bg-[#c49a3a]"}`}
        >
          <Save size={16} /> {saved ? "已保存" : "保存设置"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4">基本信息</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">公司名称</label>
              <input value={form.companyName || ""} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">公司简介</label>
              <textarea value={form.companyDesc || ""} onChange={(e) => setForm({ ...form, companyDesc: e.target.value })} rows={4} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4">联系方式</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">联系电话</label>
              <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">电子邮箱</label>
              <input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">公司地址</label>
              <input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4">版权信息</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">版权声明</label>
              <input value={form.copyright || ""} onChange={(e) => setForm({ ...form, copyright: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" placeholder="© 2024 南京迈进建设工程有限公司" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4">其他设置</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Logo 图片</label>
              {form.logo && <img src={form.logo} className="w-24 h-24 object-contain border rounded-lg mb-2" />}
              <label className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-200">
                <Upload size={14} /> {uploading === "logo" ? "上传中..." : "上传 Logo"}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} className="hidden" disabled={uploading === "logo"} />
              </label>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">微信二维码</label>
              {form.wechatQr && <img src={form.wechatQr} className="w-24 h-24 object-contain border rounded-lg mb-2" />}
              <label className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-200">
                <Upload size={14} /> {uploading === "wechatQr" ? "上传中..." : "上传二维码"}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "wechatQr")} className="hidden" disabled={uploading === "wechatQr"} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
