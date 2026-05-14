"use client";
import { useState, useEffect } from "react";
import { Check, Eye, Trash2, MessageSquare } from "lucide-react";

interface Message {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = () => fetch("/api/messages").then((r) => r.json()).then(setMessages);
  useEffect(() => { load(); }, []);

  const markRead = async (m: Message) => {
    if (m.read) return;
    await fetch(`/api/messages/${m.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...m, read: true }) });
    load();
  };

  const markAllRead = async () => {
    await Promise.all(messages.filter((m) => !m.read).map((m) =>
      fetch(`/api/messages/${m.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...m, read: true }) })
    ));
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除？")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">留言管理</h1>
          {unread > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unread} 未读</span>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
            <Check size={16} /> 全部标为已读
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-1 max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
              <p>暂无留言</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                onClick={() => { setSelected(m); markRead(m); }}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === m.id ? "bg-[#D4A843]/5" : ""} ${!m.read ? "bg-blue-50/50" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{m.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.phone || m.email || "未留联系方式"}</p>
                  </div>
                  {!m.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{m.content}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm lg:col-span-2">
          {selected ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">{selected.name}</h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    {selected.phone && <span>电话：{selected.phone}</span>}
                    {selected.email && <span>邮箱：{selected.email}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!selected.read && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">未读</span>}
                  <button onClick={() => handleDelete(selected.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                </div>
              </div>
              <div className="bg-[#F7F7F7] rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap">{selected.content}</div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-gray-400">
              <Eye size={40} className="mb-3 opacity-30" />
              <p>选择一条留言查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
