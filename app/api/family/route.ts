import { NextRequest, NextResponse } from "next/server";
import { Family, IFamily } from "../../lib/models/Family";
import { createDoc, getDocs } from "../../lib/crud";
import type { ApiResponse } from "../../lib/type/api";
import { Types } from "mongoose";

// ── GET /api/family ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  let message = ""
  try {
    const { searchParams } = new URL(request.url);

    const isApprovedParam = searchParams.get("isApproved");
    const vanshIdParam = searchParams.get("vanshId");

    const limit = Number(searchParams.get("limit")) || 100;
    const skip = Number(searchParams.get("skip")) || 0;

    const filter: Record<string, any> = {};
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
    // ── NORMALIZE ONLY (no heavy validation) ──
    const payload = {
      ...body,
      spouse: Array.isArray(body.spouse)
        ? body.spouse
        : body.spouse
          ? [body.spouse]
          : [],
    };
    const newFamily = await createDoc(Family, payload);

    // spouse ↔ spouse
    if (payload.spouse?.length && newFamily._id) {
      const spouseIds = payload.spouse.map((id) => id.toString());

      await Promise.all([
        // update spouses → add new person
        ...spouseIds.map((id) =>
          Family.findByIdAndUpdate(id, {
            $addToSet: { spouse: newFamily._id }, // 🔥 no duplicates
          })
        ),

        // update new person → add spouses
        Family.findByIdAndUpdate(newFamily._id, {
          $addToSet: { spouse: { $each: spouseIds } },
        }),
      ]);
    }

    return NextResponse.json<ApiResponse<typeof newFamily>>(
      { success: true, data: newFamily },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}