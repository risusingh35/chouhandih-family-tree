"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "../constants/colors";
import Ornament from "../components/ui/Ornament";
import { Footer } from "../components/ui/Footer";
import type { IGroup } from "../types";

const GroupPage = () => {
  const [group, setGroup] = useState<IGroup | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGroup = async () => {
      const res = await fetch("/api/groups");
      const json = await res.json();
      setGroup(json.data[0]);
    };
    fetchGroup();
  }, []);

  if (!group) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: COLORS.cream,
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "40px 20px",
          background: `linear-gradient(rgba(255,253,248,0.85), rgba(255,253,248,0.95)), url(${group.hero?.image}) center/cover`,
        }}
      >
        <p style={{ color: COLORS.gold, letterSpacing: "0.2em" }}>
          ✦ Vansh Vriksha ✦
        </p>

        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 60px)",
            color: COLORS.bark,
          }}
        >
          {group.name}
          <span
            style={{ display: "block", fontSize: "0.5em", color: COLORS.gold }}
          >
            {group.nameHindi}
          </span>
        </h1>
        <p
          style={{
            margin: "0 auto",
            maxWidth: 520,
            fontSize: 14,
            color: COLORS.muted,
            lineHeight: 1.7,
          }}
        >
          {group.description}
        </p>
        <Ornament width={180} />

        <h2 style={{ color: COLORS.umber, marginTop: 10 }}>
          {group.hero?.title}
        </h2>

        <p style={{ maxWidth: 600, color: COLORS.muted }}>
          {group.hero?.subtitle}
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push(`/clans?groupId=${group._id}`)}
          style={{
            marginTop: 30,
            padding: "12px 28px",
            border: `1px solid ${COLORS.gold}`,
            background: COLORS.gold,
            color: "#fff",
            cursor: "pointer",
            borderRadius: 6,
          }}
        >
          {group.cta?.label}
        </button>
      </section>

      {/* DETAILS SECTION */}
      <section
        style={{
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <p style={{ maxWidth: 700, margin: "0 auto", color: COLORS.muted }}>
          {group.history}
        </p>

        {/* Highlights */}
        <div style={{ marginTop: 30 }}>
          {group.highlights?.map((item, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                margin: "6px",
                padding: "6px 12px",
                border: `1px solid ${COLORS.gold}`,
                borderRadius: 20,
                color: COLORS.gold,
              }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Quote */}
        <blockquote
          style={{
            marginTop: 30,
            fontStyle: "italic",
            color: COLORS.umber,
          }}
        >
          “{group.quote?.text}”
          <br />
          <span style={{ fontSize: 12 }}>— {group.quote?.author}</span>
        </blockquote>
      </section>

      {/* FOOTER ALWAYS VISIBLE */}
      <Footer />
    </div>
  );
};

export default GroupPage;
