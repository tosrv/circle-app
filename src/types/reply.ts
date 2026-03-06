import type { User } from "./user";

export interface Reply {
    id: number;
    content: string;
    images?: string[];
    thread_id: number;
    created: User;
    created_at: string;
    created_by: number;
}