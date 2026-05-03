const getGroups = async () => {
    try {
        const res = await fetch("/api/groups");
        if (res.ok) {
            const data = await res.json();
            return data.groups;
        } else {
            console.error("Failed to fetch groups:", res.statusText);
            return [];
        }
    } catch (error) {
        console.error("Error fetching groups:", error);
        return [];
    }
};

export { getGroups };