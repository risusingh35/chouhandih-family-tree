"use client";
import { FamilyPage } from "../src/pages/FamilyPage";
import { Suspense } from "react";
export default function Family() {
  return (
    <Suspense fallback={<div>Loading Family...</div>}>
      <FamilyPage />
    </Suspense>
  );
}