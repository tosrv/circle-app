import { Heart } from "lucide-react";

export interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
}

export default function LikeButton({ isLiked, onToggle }: LikeButtonProps) {
  return (
    <button onClick={onToggle}>
      <Heart
        className={`transition ${isLiked ? "fill-red-600 text-red-600" : "text-gray-500"}`}
      />
    </button>
  );
}
