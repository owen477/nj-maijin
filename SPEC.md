# 南京迈进建设工程有限公司官网 - SPEC

## 1. Concept & Vision
打造专业、可信、现代的企业官网，展示房建/市政/装饰三大核心业务。设计风格：简洁明亮，白底金黄点缀，传递稳重与实力感。

## 2. Design Language
- **主色**: #FFFFFF (白)
- **辅色**: #D4A843 (金黄)
- **文字**: #1A1A1A (深灰)
- **底色**: #F7F7F7 (浅灰)
- **字体**: 系统无衬线字体
- **动效**: Framer Motion, Hero淡入、卡片hover上浮、数字滚动
- **响应式断点**: 640/768/1024/1280

## 3. Layout & Structure
- 顶部固定导航(滚动变白底阴影)，底部4列footer，回到顶部按钮，移动端汉堡菜单
- 首页: Hero → 业务卡片 → 数字统计 → 精选项目 → CTA
- 关于: 简介 → 资质证书 → 企业文化
- 项目: 筛选栏 → 卡片网格 → 详情(含轮播)
- 新闻: 列表+详情，支持置顶
- 联系: 联系信息 + 百度地图 + 留言表单

## 4. Features & Interactions
- 前台全响应式，所有交互真实可用
- 后台 /admin/*, NextAuth 鉴权(admin/密码)
- CRUD + 图片上传 + 富文本 + 置顶

## 5. Technical Stack
- Next.js 14 (App Router) + Tailwind CSS + Prisma + SQLite + NextAuth
- Framer Motion, next/image, TipTap

## 6. Schema
- User: id email password name role
- Project: id title client amount date type images description sort featured
- Article: id title content cover published featured createdAt
- Message: id name phone email content read createdAt
- SiteConfig: id key value
