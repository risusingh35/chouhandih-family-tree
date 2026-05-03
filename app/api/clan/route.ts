import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Clan } from "app/lib/models/Clans";
import type { ApiResponse } from "../../lib/type/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const groupIdParam = searchParams.get("groupId");
    const limit = Number(searchParams.get("limit")) || 100;
    const skip = Number(searchParams.get("skip")) || 0;

    // ── validation ─────────────────────────────────────────────
    if (!groupIdParam) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "groupId is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(groupIdParam)) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Invalid groupId" },
        { status: 400 }
      );
    }

    const groupId = new mongoose.Types.ObjectId(groupIdParam);

    // ── query with populate ────────────────────────────────────
    const clans = await Clan.aggregate([
      {
        $match: {
          groupId: new mongoose.Types.ObjectId(groupId),
        },
      },
      {
        $lookup: {
          from: "vansh",
          localField: "vanshId",
          foreignField: "_id",
          as: "vansh",
        },
      },
      {
        $unwind: {
          path: "$vansh",
          preserveNullAndEmptyArrays: true, // avoids crash if missing
        },
      },
      {
        $project: {
          slug: 1,
          name: 1,
          altName: 1,
          origin: 1,
          kuldevi: 1,
          description: 1,
          subclans: 1,
          accent: 1,
          groupId: 1,

          vansh: {
            _id: "$vansh._id",
            name: "$vansh.name",
            slug: "$vansh.slug",
            color: "$vansh.color",
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return NextResponse.json<ApiResponse<typeof clans>>(
      {
        success: true,
        data: clans,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("GET /api/clan:", message);

    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── POST /api/groups ───────────────────────────────────────────────────────────
// export async function POST(request: NextRequest) {
//   try {
//     const body: Partial<IGroup> = await request.json();
//     const item = await createDoc(Clan, body);

//     return NextResponse.json<ApiResponse<typeof item>>(
//       { success: true, data: item },
//       { status: 201 }
//     );
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     const isValidation = (error as { name?: string }).name === "ValidationError";
//     console.error("POST /api/groups:", message);
//     return NextResponse.json<ApiResponse<never>>(
//       { success: false, error: message },
//       { status: isValidation ? 400 : 500 }
//     );
//   }
// }