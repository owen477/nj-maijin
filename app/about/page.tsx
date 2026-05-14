import type { Metadata } from "next";
import Image from "next/image";
import { Award, Users, Target } from "lucide-react";

export const metadata: Metadata = { title: "关于我们" };

const certs = [
  "建筑工程施工总承包一级", "市政公用工程施工总承包一级", "建筑装修装饰工程专业承包一级",
  "钢结构工程专业承包二级", "地基基础工程专业承包二级", "安全生产许可证",
  "ISO9001质量管理体系认证", "ISO14001环境管理体系认证", "职业健康安全管理体系认证",
  "江苏省优秀建筑企业", "南京市重合同守信用企业", "AAA级信用企业",
];

const values = [
  { icon: Award, title: "质量为本", desc: "始终坚持质量第一原则，所有项目均按国家标准和行业规范严格执行" },
  { icon: Users, title: "人才强企", desc: "拥有各类专业技术人员260余人，其中一级建造师28人，二级建造师65人" },
  { icon: Target, title: "诚信经营", desc: "连续12年荣获\"江苏省重合同守信用企业\"称号，赢得客户广泛信赖" },
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F7F7F7] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">关于我们</h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            南京迈进建设工程有限公司成立于2006年，是一家集房屋建筑、市政工程、装饰装修于一体的综合性建筑企业。公司注册资本1亿元，具备建筑工程施工总承包一级等12项专业资质，年施工能力超30亿元。
          </p>
        </div>
      </section>

      {/* Values */}
      <section id="culture" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-14">企业文化</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="w-16 h-16 bg-[#D4A843] rounded-full flex items-center justify-center mx-auto mb-5">
                  <v.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section id="certs" className="py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-14">资质荣誉</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {certs.map((c) => (
              <div key={c} className="bg-white rounded-lg p-5 text-center shadow-sm hover:shadow transition-shadow">
                <div className="w-10 h-10 bg-[#D4A843]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award size={18} className="text-[#D4A843]" />
                </div>
                <p className="text-xs text-gray-700 font-medium leading-snug">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
