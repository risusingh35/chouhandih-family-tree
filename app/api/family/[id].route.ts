// app/api/items/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Family, IFamily } from "../../lib/models/Family";
import { getDocById, updateDoc, deleteDoc } from "../../lib/crud";
import type { ApiResponse } from "../../lib/type/api";

interface RouteParams {
  params: { id: string };
}

// ── GET /api/items/:id ────────────────────────────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const item = await getDocById(Family, params.id);

    if (!item) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof item>>(
      { success: true, data: item },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/items/:id:", message);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── PUT /api/items/:id ────────────────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body: Partial<IFamily> = await request.json();
    const updated = await updateDoc(Family, params.id, body);

    if (!updated) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof updated>>(
      { success: true, data: updated },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isValidation = (error as { name?: string }).name === "ValidationError";
    console.error("PUT /api/items/:id:", message);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: message },
      { status: isValidation ? 400 : 500 }
    );
  }
}

// ── DELETE /api/items/:id ─────────────────────────────────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const deleted = await deleteDoc(Family, params.id);

    if (!deleted) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<null>>(
      { success: true, data: null, message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("DELETE /api/items/:id:", message);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}