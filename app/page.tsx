"use client";

import TreeView from "./src/components/TreeView";
import personsData from "../public/data/family.json";
import { buildTree } from "./src/utils/buildTree";

export default function HomePage() {
  const tree = buildTree(personsData.persons);
// console.log("tree", tree);
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: 40,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <TreeView tree={tree} />
    </main>
  );
}