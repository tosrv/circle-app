import { ImagePlus } from "lucide-react";
import { Button } from "../components/ui/button";
import ThreadsLists from "../components/thread/ThreadsLists";
import { Card, CardContent } from "../components/ui/card";
import { useRef, useEffect } from "react";
import { useThread } from "@/hooks/useThread";
import { useThreadDialog } from "@/context/ThreadProvider";
import { notifySuccess } from "@/lib/toast";
import { useProfile } from "@/context/ProfileProvider";

export default function Threads() {
  const { user } = useProfile();
  const { threads, fetchThreads } = useThread();
  const fileRef = useRef<HTMLInputElement>(null);
  const { openThreadDialog, addImages, content } = useThreadDialog();

  useEffect(() => {
    fetchThreads();
  }, []);

  const onPickImage = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addImages(Array.from(e.target.files));
    openThreadDialog();

    notifySuccess("Image uploaded!");

    e.currentTarget.value = "";
  };

  const openDialog = () => openThreadDialog();

  return (
    <div>
      <Card className="p-5 rounded-none border-0 border-b-2 bg-transparent shadow-none">
        <div className="grid grid-cols-[60px_1fr]">
          <section className="h-17 w-17 rounded-full overflow-hidden border-2 border-white">
            <img
              src={
                user?.photo_profile
                  ? user.photo_profile
                  : "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg"
              }
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </section>
          <CardContent className="flex w-full justify-between items-center">
            <div
              onClick={openDialog}
              className="text-2xl text-gray-500 w-8/10 max-w-140 truncate overflow-hidden"
            >
              {content || "What is happening?!"}
            </div>

            <div className="flex items-center space-x-3">
              <span
                onClick={onPickImage}
                className="text-green-600 hover:cursor-pointer"
              >
                <ImagePlus />
              </span>

              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />

              <Button
                onClick={openDialog}
                className="bg-green-500 text-lg rounded-2xl text-white hover:text-black"
              >
                Post
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
      <ThreadsLists threads={threads} />
    </div>
  );
}
