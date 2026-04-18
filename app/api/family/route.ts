// app/api/items/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Family, IFamily } from "../../lib/models/Family";
import { createDoc, getDocs } from "../../lib/crud";
import type { ApiResponse } from "../../lib/type/api";
import { Types } from "mongoose";

// ── GET /api/items ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const isApprovedParam = searchParams.get("isApproved");
    const vanshIdParam = searchParams.get("vanshId");

    const limit = Number(searchParams.get("limit")) || 100;
    const skip = Number(searchParams.get("skip")) || 0;

    const filter: Record<string, any> = {};

    // ✅ Vansh Logic (FIXED)
    if (vanshIdParam) {
      filter.$or = [
        { vanshId: new Types.ObjectId(vanshIdParam) },
        { vanshId: null },
        { vanshId: { $exists: false } }, // safety
      ];
    } else {
      filter.$or = [
        { vanshId: null },
        { vanshId: { $exists: false } },
      ];
    }

    // ✅ Approved Filter (FIXED FIELD)
    if (isApprovedParam !== null) {
      filter.isApproved = isApprovedParam === "true";
    }

    //     console.log("filter------------", filter);
    //     const data=db.families.find(
    //   { _id: ObjectId("69e37d8d2503bbdc6a178115") },
    //   { vanshId: 1 }
    // )
    //     console.log("DB COUNT:", await Family.countDocuments());
    //     console.log("NULL COUNT:", await Family.countDocuments({ vanshId: null }));
    // ✅ APPLY FILTER (MAIN FIX)
    const items = await getDocs(Family, filter, {
      sort: { createdAt: -1 },
      limit,
      skip,
    });

    console.log("items--------------", items);

    return NextResponse.json<ApiResponse<typeof items>>(
      { success: true, data: items },
      { status: 200 }
    );
  } catch (error) {
    const message =
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