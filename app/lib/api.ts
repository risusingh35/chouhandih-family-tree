// lib/api.ts
// Typed client-side fetch helpers — use in components / server components

import {  IFamily } from "./models/Family";
import type { ApiResponse } from "./type/api";

const BASE = "/api/items";

async function handleResponse<T>(res: Response): Promise<T> {
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

// ── READ ALL ──────────────────────────────────────────────────────────────────
export interface FetchItemsOptions {
  limit?: number;
  skip?: number;
  isActive?: boolean;
}

export async function fetchItems(options: FetchItemsOptions = {}): Promise<IFamily[]> {
  const { limit = 100, skip = 0, isActive } = options;
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });
  if (isActive !== undefined) params.set("isActive", String(isActive));

  const res = await fetch(`${BASE}?${params}`);
  return handleResponse<IFamily[]>(res);
}

// ── READ ONE ──────────────────────────────────────────────────────────────────
export async function fetchItem(id: string): Promise<IFamily> {
  const res = await fetch(`${BASE}/${id}`);
  return handleResponse<IFamily>(res);
}

// ── CREATE ────────────────────────────────────────────────────────────────────
export async function createItem(payload: Partial<IFamily>): Promise<IFamily> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<IFamily>(res);
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
export async function updateItem(
  id: string,
  payload: Partial<IFamily>
): Promise<IFamily> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<IFamily>(res);
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  await handleResponse<null>(res);
}