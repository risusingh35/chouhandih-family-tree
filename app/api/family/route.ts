// app/api/items/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Family, IFamily } from "../../lib/models/Family";
import { createDoc, getDocs } from "../../lib/crud";
import type { ApiResponse } from "../../lib/type/api";
import { Types } from "mongoose";

// ── GET /api/items ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  let message = ""
  try {
    const { searchParams } = new URL(request.url);

    const isApprovedParam = searchParams.get("isApproved");
    const vanshIdParam = searchParams.get("vanshId");

    const limit = Number(searchParams.get("limit")) || 100;
    const skip = Number(searchParams.get("skip")) || 0;

    const filter: Record<string, any> = {};
    // console.log("vanshIdParam------------", vanshIdParam);
    if (!vanshIdParam) {
      message = "Vansh Id is required"
      console.error("GET /api/family:", message);
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: message },
        { status: 500 }
      );
    }
    filter.$or = [
      { vanshId: new Types.ObjectId(vanshIdParam) },
      { vanshId: null },
    ]

    // ✅ Approved Filter (FIXED FIELD)
    if (isApprovedParam !== null) {
      filter.isApproved = isApprovedParam === "true";
    }
    // ✅ APPLY FILTER (MAIN FIX)
    const items = await getDocs(Family, filter, {
      sort: { createdAt: -1 },
      limit,
      skip,
    });
    return NextResponse.json<ApiResponse<typeof items>>(
      { success: true, data: items },
      { status: 200 }
    );
  } catch (error) {
    message =
      error instanceof Error ? error.message : "Unknown error";

    console.error("GET /api/family:", message);

    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── POST ───────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: Partial<IFamily> = await request.json();

    const item = await createDoc(Family, body);

    return NextResponse.json<ApiResponse<typeof item>>(
      { success: true, data: item },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    const isValidation =
      (error as { name?: string }).name === "ValidationError";

    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: message },
      { status: isValidation ? 400 : 500 }
    );
  }
}