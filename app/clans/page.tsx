"use client";
import { ClansPage } from "../src/pages/ClansPage";
import { Suspense } from "react";
export default function Clans() {
  return (
    <Suspense fallback={<div>Loading Clans...</div>}>
      <ClansPage />
    </Suspense>
  );
}