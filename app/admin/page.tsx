"use client";
import { useState, useEffect } from "react";
import { FolderOpen, FileText, MessageSquare, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, articles: 0, messages: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/articles").then((r) => r.json()),
      fetch("/api/messages").then((r) => r.json()),
    ]).then(([projects, articles, messages]) => {
      setStats({ projects: projects.length, articles: articles.length, messages: messages.length });
    });
  }, []);

  const cards = [
    { label: "项目总数", value: stats.projects, icon: FolderOpen, color: "bg-blue-500" },
    { label: "新闻文章", value: stats.articles, icon: FileText, color: "bg-green-500" },
    { label: "留言数", value: stats.messages, icon: MessageSquare, color: "bg-purple-500" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">仪表盘</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${c.color} rounded-lg flex items-center justify-center`}>
                <c.icon className="text-white" size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats[c.label as keyof typeof stats] === 0 ? "-" : stats[c.label as keyof typeof stats]}</p>
                <p className="text-sm text-gray-500">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
