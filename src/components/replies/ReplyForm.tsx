import { ImagePlus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { useProfile } from "@/context/ProfileProvider";
import { notifyError, notifySuccess, notifyWarn } from "@/lib/toast";

interface ReplyFormProps {
  onSubmit: (content: string, images: File[]) => void;
  loading: boolean;
}
export default function ReplyForm({ onSubmit, loading }: ReplyFormProps) {
  const { user } = useProfile();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickImage = () => {
    fileRef.current?.click();
  };

  const handleImageSelect = (files: File[]) => {
    setImages((prev) => [...prev, ...files]);
  };
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (images.length + files.length > 4) {
      notifyWarn("Maximum 4 images!");
      e.currentTarget.value = "";
      return;
    }

    handleImageSelect(files);

    files.forEach(() => notifySuccess("Image uploaded!"));

    e.currentTarget.value = "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      onSubmit(content, images);
      setImages([]);
      setContent("");

      notifySuccess("New reply created!");
    } catch (err) {
      notifyError("Failed to create reply!");
    }
  };

  return (
    <div className="">
      <Card className="p-5 rounded-none border-0 border-b-2 bg-transparent">
        <div className="grid grid-cols-[70px_1fr]">
          <div className="flex items-center">
            <section className="h-17 w-17 border-2 border-white rounded-full overflow-hidden">
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
          </div>
          <CardContent>
            <form
              className="flex w-full h-full justify-between items-center"
              onSubmit={handleSubmit}
            >
              <div className="flex w-9/10 space-x-2">
                <section className="h-20 w-auto">
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {images.map((image, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Image"
                            className="w-20 h-20 object-cover rounded-md"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-1
        opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <textarea
                  spellCheck={false}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="Type your reply!"
                  className="text-lg border-none focus:outline-none bg-transparent h-full resize-none overflow-auto"
                />
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
                  type="submit"
                  disabled={!content || loading}
                  className="bg-green-500 text-lg rounded-2xl text-white hover:text-black"
                >
                  {loading ? "Sending..." : "Reply"}
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
