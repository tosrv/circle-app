import { useEffect } from "react";
import FollowsList from "./FollowsList";
import { useFollow } from "@/hooks/useFollow";

export default function Suggestion() {
  const listKey = "suggestions";
  const { fetchSuggestions } = useFollow(listKey);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="p-3 bg-gray-900 rounded-md">
      <h2 className="font-bold text-xl">Suggested for you</h2>
      <FollowsList listKey={listKey} />
    </div>
  );
}
