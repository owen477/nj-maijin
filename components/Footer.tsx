import Link from "next/link";

const footerCols = [
  {
    title: "关于我们",
    links: [
      { label: "公司简介", href: "/about" },
      { label: "企业文化", href: "/about#culture" },
      { label: "资质荣誉", href: "/about#certs" },
    ],
  },
  {
    title: "业务范围",
    links: [
      { label: "房屋建筑", href: "/projects?type=房建" },
      { label: "市政工程", href: "/projects?type=市政" },
      { label: "装饰装修", href: "/projects?type=装饰" },
    ],
  },
  {
    title: "新闻动态",
    links: [
      { label: "公司新闻", href: "/news" },
      { label: "行业资讯", href: "/news" },
    ],
  },
  {
    title: "联系我们",
    links: [
      { label: "联系方式", href: "/contact" },
      { label: "在线留言", href: "/contact#form" },
      { label: "管理后台", href: "/admin" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerCols.map((col) => (
            <div key={col.title}>
              <h3 className="font-semibold text-[#D4A843] mb-4 text-sm">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} 南京迈进建设工程有限公司 版权所有
        </div>
      </div>
    </footer>
  );
}
