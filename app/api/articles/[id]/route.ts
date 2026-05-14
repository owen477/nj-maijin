import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({ where: { id: Number(params.id) } });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const article = await prisma.article.update({ where: { id: Number(params.id) }, data: body });
  return NextResponse.json(article);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.article.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
