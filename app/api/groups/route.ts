import { NextRequest, NextResponse } from "next/server";
import { createDoc, getDocs } from "../../lib/crud";
import type { ApiResponse } from "../../lib/type/api";
import { Group } from "app/lib/models/Group";
import type { IGroup } from "app/src/types";

// ── GET /api/groups ────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const isActiveParam = searchParams.get("isActive");
    const limit = Number(searchParams.get("limit")) || 100;
    const skip = Number(searchParams.get("skip")) || 0;

    const filter: Record<string, unknown> = {};
    if (isActiveParam !== null) filter.isActive = isActiveParam === "true";

    const groups = await getDocs(Group, filter, { sort: { createdAt: -1 }, limit, skip });

    return NextResponse.json<ApiResponse<typeof groups>>(
      { success: true, data: groups },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/groups:", message);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── POST /api/groups ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: Partial<IGroup> = await request.json();
    const item = await createDoc(Group, body);

    return NextResponse.json<ApiResponse<typeof item>>(
      { success: true, data: item },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isValidation = (error as { name?: string }).name === "ValidationError";
    console.error("POST /api/groups:", message);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: message },
      { status: isValidation ? 400 : 500 }
    );
  }
}