"use client";

import { useState } from "react";
import GroupSelectPage from "./src/components/GroupSelectPage";
import FamilyTreeView  from "./src/components/Familytreeview";
import personsData     from "../public/data/family.json";
import type { Person } from "./src/utils/buildTree";

interface Selection { groupId: string; clanId: string; }

const C = { gold:"#c9a96e", oak:"#a8845a", umber:"#7a5c35", bark:"#2c1f0e", sand:"#ddd4c5", cream:"#fffdf8", muted:"#9a8570" };

const Breadcrumb = ({ selection, onBack }: { selection: Selection; onBack: () => void }) => (
  <div style={{ position:"fixed", bottom:24, left:24, zIndex:800, display:"flex", alignItems:"center", gap:8, padding:"9px 14px", borderRadius:12, background:"rgba(253,246,236,0.92)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)", border:`1px solid ${C.sand}`, boxShadow:"0 4px 16px rgba(44,31,14,0.12)", fontFamily:"'DM Sans', sans-serif", fontSize:12, animation:"bc-in 0.3s ease forwards" }}>
    <style>{`@keyframes bc-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    <button type="button" onClick={onBack} aria-label="Back to clan selection"
      style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, border:`1.5px solid ${C.sand}`, background:"transparent", color:C.umber, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontSize:12, fontWeight:600, transition:"background 0.15s" }}
      onMouseEnter={(e)=>(e.currentTarget.style.background="rgba(201,169,110,0.12)")}
      onMouseLeave={(e)=>(e.currentTarget.style.background="transparent")}
    >← Clans</button>
    <span aria-hidden style={{color:C.sand}}>·</span>
    <span style={{color:C.muted,fontWeight:500,textTransform:"capitalize"}}>{selection.groupId}</span>
    <span aria-hidden style={{color:C.gold}}>›</span>
    <span style={{color:C.bark,fontWeight:700,textTransform:"capitalize",letterSpacing:"0.02em"}}>
      {selection.clanId.charAt(0).toUpperCase()+selection.clanId.slice(1)}
    </span>
  </div>
);

export default function HomePage() {
  const [selection, setSelection] = useState<Selection | null>(null);

  if (!selection) {
    return <GroupSelectPage onSelect={(g, c) => setSelection({ groupId: g, clanId: c })} />;
  }

  return (
    <>
      <FamilyTreeView
        initialPersons={personsData.persons as Person[]}
        storageKey={`family-tree-${selection.groupId}-${selection.clanId}`}
      />
      <Breadcrumb selection={selection} onBack={() => setSelection(null)} />
    </>
  );
}