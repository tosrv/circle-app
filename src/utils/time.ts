export function timeAgo(date: string | Date) {
    const now = new Date();
    const past = new Date(date);
   
    const diffMs = now.getTime() - past.getTime()
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs <= 30) return "Just now";
    if (diffMins < 1) return `${diffSecs} seconds ago`;
    if (diffHours < 1) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return past.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })

}