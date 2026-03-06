export interface Like {
  id: number;
  user_id: number;
  thread_id: number;
}

export interface LikeState {
  likes: Record<number, boolean>;
  likeCount: Record<number, number>;
}