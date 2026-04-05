// app/api/items/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PersonModel, IPerson } from "../../lib/models/Family";
import { createDoc, getDocs } from "../../lib/crud";
import type { ApiResponse } from "../../lib/type/api";

// ── GET /api/items ────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const isActiveParam = searchParams.get("isActive");
    const limit = Number(searchParams.get("limit")) || 100;
    const skip = Number(searchParams.get("skip")) || 0;

    const filter: Record<string, unknown> = {};
    if (isActiveParam !== null) filter.isActive = isActiveParam === "true";

    const items = await getDocs(PersonModel, filter, { sort: { createdAt: -1 }, limit, skip });

    return NextResponse.json<ApiResponse<typeof items>>(
      { success: true, data: items },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/items:", message);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── POST /api/items ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: Partial<IPerson> = await request.json();
    const item = await createDoc(PersonModel, body);

    return NextResponse.json<ApiResponse<typeof item>>(
      { success: true, data: item },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isValidation = (error as { name?: string }).name === "ValidationError";
    console.error("POST /api/items:", message);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: message },
      { status: isValidation ? 400 : 500 }
    );
  }
}