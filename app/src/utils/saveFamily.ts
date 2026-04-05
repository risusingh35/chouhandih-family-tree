import type { Person } from "../types";

export async function saveFamily(persons: Person[]): Promise<boolean> {
    try {
        console.log("persons-------------", persons);
        const requestData = persons[0]
        const body = JSON.stringify({ ...requestData });
        const res = await fetch("/api/family", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
        });
        console.log("res-------------", res);

        return res.ok;
    } catch {
        return false;
    }
}