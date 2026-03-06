import UserFollows from "@/components/follows/UserFollows";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

export default function Follows() {
  const { user } = useAuth();

  const username = user?.username;

  return (
    <>
      <Tabs defaultValue="followers">
        <TabsList className="flex w-full font-semibold text-lg text-gray-500">
          <TabsTrigger
            value="followers"
            className="w-1/2 p-2 border-b-2 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500"
          >
            Followers
          </TabsTrigger>
          <TabsTrigger
            value="followings"
            className="w-1/2 p-2 border-b-2 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-500"
          >
            Following
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followers">
          {username && <UserFollows type="followers" username={username} />}
        </TabsContent>

        <TabsContent value="followings">
          {username && <UserFollows type="followings" username={username} />}
        </TabsContent>
        
      </Tabs>
    </>
  );
}
