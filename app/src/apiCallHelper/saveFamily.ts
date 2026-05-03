import type { Family } from "../types";

export async function saveFamily(persons: Family): Promise<boolean> {
    try {
        console.log("persons-requests------------123", persons);
        const requestData = persons
        const body = JSON.stringify({ ...requestData });
        const res = await fetch("/api/family", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
        });
        console.log("persons-res------------123", persons);

        return res.ok;
    } catch {
        return false;
    }
}