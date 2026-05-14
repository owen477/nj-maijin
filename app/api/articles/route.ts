import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get("admin") === "true";
  const articles = await prisma.article.findMany({
    where: admin ? undefined : { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(articles);
}

export async function POST(req: Request) {
  const body = await req.json();
  const article = await prisma.article.create({ data: body });
  return NextResponse.json(article);
}
