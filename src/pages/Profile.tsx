import ThreadsLists from "@/components/thread/ThreadsLists";
import Media from "@/components/user/Media";
import UserProfile from "@/components/user/UserProfile";
import { useThread } from "@/hooks/useThread";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { fetchThreads, getUserThreads } = useThread();

  useEffect(() => {
    fetchThreads();
  }, []);

  const threads = getUserThreads(username || "");

  if (!username)
    return (
      <div className="flex justify-center items-center h-30">
        <h2 className="text-2xl text-gray-500">User not found</h2>
      </div>
    );

  return (
    <>
      <UserProfile username={username} />

      <Tabs defaultValue="all">
        <TabsList className="flex w-full font-semibold text-lg text-gray-500">
          <TabsTrigger
            value="all"
            className="w-1/2 p-2 border-b-2 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500"
          >
            All Threads
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="w-1/2 p-2 border-b-2 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500"
          >
            Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ThreadsLists threads={threads} />
        </TabsContent>

        <TabsContent value="media">
          <Media threads={threads} />
        </TabsContent>
      </Tabs>
    </>
  );
}
