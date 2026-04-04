// app/api/family/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "public", "data", "family.json");

// GET /api/family — read current file
export async function GET() {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ persons: [] }, { status: 200 });
  }
}

// POST /api/family — overwrite file with new persons array
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body?.persons)) {
      return NextResponse.json(
        { error: "Body must be { persons: [...] }" },
        { status: 400 }
      );
    }

    const content = JSON.stringify({ persons: body.persons }, null, 2);
    await fs.writeFile(FILE_PATH, content, "utf-8");

    return NextResponse.json({ ok: true, count: body.persons.length });
  } catch (err) {
    console.error("[family/route] write error:", err);
    return NextResponse.json({ error: "Failed to write file" }, { status: 500 });
  }
}