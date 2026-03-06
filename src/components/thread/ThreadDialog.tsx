import { ImagePlus } from "lucide-react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { notifyError, notifySuccess, notifyWarn } from "@/lib/toast";
import { useProfile } from "@/context/ProfileProvider";

export interface ThreadDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  images: File[];
  onImageSelect: (file: File[]) => void;
  onRemoveImage: (index: number) => void;
  clearImage: () => void;

  content?: string;
  setContent?: (value: string) => void;

  newThread: (content: string) => void;
}

export default function ThreadDialog({
  open,
  onOpenChange,
  images,
  onImageSelect,
  onRemoveImage,
  clearImage,
  content,
  setContent,
  newThread,
}: ThreadDialogProps) {
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useProfile();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (images.length + files.length > 4) {
      notifyWarn("Maximum 4 images!");
      e.currentTarget.value = "";
      return;
    }

    onImageSelect(files);

    files.forEach(() => notifySuccess("Image uploaded!"));

    e.currentTarget.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    try {
      newThread(content);
      setContent?.("");
      clearImage?.();

      notifySuccess("New thread created!");
    } catch (err) {
      notifyError("Failed to create thread!");
    }
  };

  useEffect(() => {
    if (!images.length) {
      setImageUrl([]);
      return;
    }

    const urls = images.map((file) => URL.createObjectURL(file));
    setImageUrl(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900">
        <input
          type="file"
          onChange={onFileChange}
          ref={fileRef}
          accept="images/*"
          hidden
          multiple
        />
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="grid grid-cols-[70px_1fr] mb-5 space-x-3">
              <DialogTitle>
                <img
                  src={user?.photo_profile}
                  alt="Avatar"
                  className="w-full rounded-full"
                />
              </DialogTitle>
              <DialogDescription asChild>
                <div className="flex flex-col">
                  <textarea
                    spellCheck={false}
                    value={content}
                    onChange={(e) => setContent?.(e.target.value)}
                    placeholder="What is happening?!"
                    required
                    className="w-full resize-none border-none focus:outline-none h-fit overflow-auto text-lg p-2"
                  />

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-96 overflow-auto">
                      {imageUrl.map((url, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={url}
                            className="rounded-lg h-full w-full overflow-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => onRemoveImage(i)}
                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-1
                              opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogDescription>
            </div>
            <hr />
          </DialogHeader>
          <DialogFooter>
            <div className="flex justify-between items-center w-full mt-3 px-5">
              <span
                onClick={() => {
                  fileRef.current?.click();
                }}
                className={
                  images.length < 4
                    ? "text-green-600 hover:cursor-pointer"
                    : "text-green-800"
                }
              >
                <ImagePlus />
              </span>
              <Button
                type="submit"
                className="bg-green-500 text-lg rounded-2xl text-white hover:text-black"
                disabled={!content}
              >
                Post
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
