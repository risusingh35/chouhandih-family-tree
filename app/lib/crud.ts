// lib/crud.ts

import {
  Model,
  Document,
  UpdateQuery,
  SortOrder,
  FlattenMaps,
  InferRawDocType,
} from "mongoose";
import connectDB from "./mongodb";

type LeanDoc<T> = FlattenMaps<InferRawDocType<T>> & { _id: unknown };

interface GetDocsOptions {
  sort?: Record<string, SortOrder>;
  limit?: number;
  skip?: number;
  select?: string;
}

// ── CREATE ────────────────────────────────────────────────────────────────────
export async function createDoc<T extends Document>(
  Model: Model<T>,
  data: Partial<T>
): Promise<LeanDoc<T>> {
  await connectDB();
  const doc = new Model(data);
  await doc.save();
  return doc.toObject() as LeanDoc<T>;
}

// ── READ ALL ──────────────────────────────────────────────────────────────────
export async function getDocs<T extends Document>(
  Model: Model<T>,
  filter: any = {},
  {
    sort = { createdAt: -1 },
    limit = 100,
    skip = 0,
    select = "",
  }: GetDocsOptions = {}
): Promise<LeanDoc<T>[]> {
  await connectDB();
  return Model.find(filter)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .select(select)
    .lean() as Promise<LeanDoc<T>[]>;
}

// ── READ ONE ──────────────────────────────────────────────────────────────────
export async function getDocById<T extends Document>(
  Model: Model<T>,
  id: string
): Promise<LeanDoc<T> | null> {
  await connectDB();
  return Model.findById(id).lean() as Promise<LeanDoc<T> | null>;
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
export async function updateDoc<T extends Document>(
  Model: Model<T>,
  id: string,
  data: UpdateQuery<T>
): Promise<LeanDoc<T> | null> {
  await connectDB();
  return Model.findByIdAndUpdate(id, { $set: data }, {
    new: true,
    runValidators: true,
  }).lean() as Promise<LeanDoc<T> | null>;
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function deleteDoc<T extends Document>(
  Model: Model<T>,
  id: string
): Promise<LeanDoc<T> | null> {
  await connectDB();
  return Model.findByIdAndDelete(id).lean() as Promise<LeanDoc<T> | null>;
}

// ── EXISTS ────────────────────────────────────────────────────────────────────
export async function docExists<T extends Document>(
  Model: Model<T>,
  filter: any
): Promise<boolean> {
  await connectDB();
  return !!(await Model.exists(filter));
}