"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calendar, User, Banknote } from "lucide-react";

const defaultImages = [
  "https://picsum.photos/seed/maijin1/800/600",
  "https://picsum.photos/seed/maijin2/800/600",
  "https://picsum.photos/seed/maijin3/800/600",
];

export default function ProjectDetailClient({ project }: { project: any }) {
  const images = project.images ? JSON.parse(project.images) : defaultImages;
  const [idx, setIdx] = useState(0);
  const imgs = images.length > 0 ? images : defaultImages;

  const prev = () => setIdx((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setIdx((i) => (i + 1) % imgs.length);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="relative h-72 sm:h-96 bg-[#F7F7F7] rounded-xl overflow-hidden">
          <Image src={imgs[idx]} alt={project.title} fill className="object-cover" />
          {imgs.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white">
                <ChevronLeft size={20} />
              </button>
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white">
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
        {imgs.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {imgs.map((_: any, i: number) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full ${i === idx ? "bg-[#D4A843]" : "bg-gray-300"}`} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#F7F7F7] rounded-xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{project.title}</h1>
          <span className="shrink-0 bg-[#D4A843] text-white text-xs px-3 py-1 rounded">{project.type}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {project.client && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={16} className="text-[#D4A843]" /> {project.client}
            </div>
          )}
          {project.amount && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Banknote size={16} className="text-[#D4A843]" /> {project.amount}
            </div>
          )}
          {project.date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} className="text-[#D4A843]" /> {project.date}
            </div>
          )}
        </div>

        {project.description && (
          <div className="border-t pt-6">
            <h2 className="font-semibold mb-3">项目简介</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <a href="/projects" className="text-[#D4A843] hover:underline text-sm">← 返回项目列表</a>
      </div>
    </div>
  );
}
