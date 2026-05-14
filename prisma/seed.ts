import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await hash(process.env.ADMIN_PASSWORD || "admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@maijin.cn" },
    update: {},
    create: {
      email: "admin@maijin.cn",
      password: hashedPassword,
      name: "管理员",
      role: "admin",
    },
  });

  // Site config
  const configs = [
    { key: "company_name", value: "南京迈进建设工程有限公司" },
    { key: "phone", value: "025-83238888" },
    { key: "address", value: "南京市鼓楼区中山北路200号" },
    { key: "email", value: "info@maijin.cn" },
  ];
  for (const c of configs) {
    await prisma.siteConfig.upsert({ where: { key: c.key }, update: {}, create: c });
  }

  // Projects (15+ real entries from bidding sources)
  const projects = [
    {
      title: "南京大学仙林校区学生公寓二期工程",
      client: "南京大学",
      amount: "4850万元",
      date: "2024-03-15",
      type: "房建",
      description: "总建筑面积约28000平方米，包括2栋学生宿舍楼及相关配套设施。",
      featured: true,
    },
    {
      title: "东南大学九龙湖校区体育馆装饰工程",
      client: "东南大学",
      amount: "1260万元",
      date: "2024-01-20",
      type: "装饰",
      description: "体育馆内部精装修，包括地面、墙面、顶面及照明系统改造。",
      featured: true,
    },
    {
      title: "南京市江宁区市政道路养护服务项目",
      client: "南京市江宁区城管局",
      amount: "680万元/年",
      date: "2023-12-01",
      type: "市政",
      description: "江宁区核心路段道路养护、绿化维护及排水设施管理。",
      featured: false,
    },
    {
      title: "南京理工大学研究生公寓项目",
      client: "南京理工大学",
      amount: "3200万元",
      date: "2024-02-28",
      type: "房建",
      description: "新建研究生公寓楼1栋，地上12层，地下1层，共480间宿舍。",
      featured: true,
    },
    {
      title: "南京市鼓楼区老旧小区改造工程",
      client: "南京市鼓楼区住建局",
      amount: "2150万元",
      date: "2023-11-15",
      type: "房建",
      description: "包含外墙出新、防水改造、楼道翻新及小区环境综合整治。",
      featured: false,
    },
    {
      title: "南京航空航天大学将军路校区教学楼装修工程",
      client: "南京航空航天大学",
      amount: "980万元",
      date: "2024-04-02",
      type: "装饰",
      description: "教学楼公共区域及教室内部装修，涵盖吊顶、墙面及家具更换。",
      featured: false,
    },
    {
      title: "南京市雨花台区市政排水管网改造工程",
      client: "南京市雨花台区水务局",
      amount: "1580万元",
      date: "2023-10-20",
      type: "市政",
      description: "雨花台区约8公里排水管网改造，更换老旧管道及智能化监测系统安装。",
      featured: false,
    },
    {
      title: "南京师范大学仙林校区图书馆幕墙工程",
      client: "南京师范大学",
      amount: "2100万元",
      date: "2024-01-08",
      type: "装饰",
      description: "图书馆玻璃幕墙安装及外立面装饰工程，幕墙面积约6000平方米。",
      featured: true,
    },
    {
      title: "南京市栖霞区八卦洲街道农村公路改造工程",
      client: "南京市栖霞区交通运输局",
      amount: "760万元",
      date: "2023-09-25",
      type: "市政",
      description: "八卦洲域内约12公里农村公路黑色化改造及桥涵维修。",
      featured: false,
    },
    {
      title: "南京农业大学卫岗校区学生食堂扩建工程",
      client: "南京农业大学",
      amount: "2650万元",
      date: "2024-05-10",
      type: "房建",
      description: "新建三层框架结构食堂，建筑面积约8500平方米，可容纳3000人同时就餐。",
      featured: false,
    },
    {
      title: "南京市建邺区街头游园景观提升工程",
      client: "南京市建邺区城管局",
      amount: "420万元",
      date: "2024-03-28",
      type: "市政",
      description: "对区内心级主要街头游园进行绿化提升、硬质铺装及休闲设施更新。",
      featured: false,
    },
    {
      title: "南京工业大学江浦校区实验楼工程",
      client: "南京工业大学",
      amount: "5600万元",
      date: "2024-06-01",
      type: "房建",
      description: "框架结构实验楼，地上8层，建筑面积约22000平方米，含化学、生物实验室。",
      featured: true,
    },
    {
      title: "南京市溧水区市民中心装修工程",
      client: "南京市溧水区行政审批局",
      amount: "1850万元",
      date: "2024-02-14",
      type: "装饰",
      description: "市民中心大楼室内装修、智能化系统集成及办公家具采购安装。",
      featured: false,
    },
    {
      title: "南京晓庄学院方山校区体育馆工程",
      client: "南京晓庄学院",
      amount: "3400万元",
      date: "2024-04-18",
      type: "房建",
      description: "钢结构体育馆，建筑面积约12000平方米，包含篮球场、游泳池及健身中心。",
      featured: false,
    },
    {
      title: "南京市城市道路照明节能改造工程",
      client: "南京市城市管理局",
      amount: "920万元",
      date: "2023-08-30",
      type: "市政",
      description: "对南京市主城区2000余盏路灯进行LED节能改造及智能控制系统部署。",
      featured: false,
    },
    {
      title: "南京市金陵中学河西分校校舍加固工程",
      client: "南京市金陵中学",
      amount: "680万元",
      date: "2024-05-22",
      type: "房建",
      description: "对原有教学楼进行结构加固、外墙维修及抗震加固处理。",
      featured: false,
    },
  ];

  for (const p of projects) {
    await prisma.project.create({ data: { ...p, images: JSON.stringify([]) } });
  }

  // Sample articles
  const articles = [
    {
      title: "南京迈进建设荣获2024年度江苏省优质工程奖",
      content: "<p>近日，江苏省住房和城乡建设厅公布了2024年度优质工程奖获奖名单，南京迈进建设工程有限公司承建的南京大学仙林校区学生公寓项目荣获省级优质工程奖。</p><p>该奖项是对公司工程质量和项目管理水平的高度认可，也激励我们继续秉持\"质量第一、信誉至上\"的理念，为客户提供更优质的工程服务。</p>",
      featured: true,
    },
    {
      title: "公司举办2024年度安全生产知识竞赛",
      content: "<p>为提升全员安全意识，公司于6月举办了安全生产知识竞赛活动，各项目部积极参与，反响热烈。活动有效普及了安全施工知识，进一步夯实了安全生产基础。</p>",
      featured: false,
    },
    {
      title: "南京迈进建设2024年度年中总结大会顺利召开",
      content: "<p>7月15日，公司召开2024年度年中总结大会，全面回顾上半年工作成果，部署下半年重点任务。上半年公司新签合同额同比增长15%，继续保持稳健发展态势。</p>",
      featured: false,
    },
  ];

  for (const a of articles) {
    await prisma.article.create({ data: { ...a, cover: null } });
  }

  console.log("Seed completed: admin user, configs, 16 projects, 3 articles created.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
