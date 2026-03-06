import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { updateUser, usernameCheck } from "@/services/user.api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { useProfile } from "@/context/ProfileProvider";
import { ImagePlus } from "lucide-react";
import { notifyError, notifySuccess } from "@/lib/toast";
import { editUser } from "@/store/auth/auth.slice";

export function EditDialog() {
  const { user, setUser, editDialogOpen, setEditDialogOpen } = useProfile();
  const [available, setAvailable] = useState(false);
  const [avatarImage, setAvatarImage] = useState<File | undefined>(undefined);
  const [checking, setChecking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    name: user?.full_name ?? "",
    username: user?.username ?? "",
    bio: user?.bio ?? "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.full_name ?? "",
        username: user.username ?? "",
        bio: user.bio ?? "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!form.username || form.username.length < 3) {
      setAvailable(false);
      return;
    }

    if (form.username === user?.username) {
      setAvailable(true);
      return;
    }

    setChecking(true);
    const timer = setTimeout(async () => {
      try {
        const res = await usernameCheck(form.username);
        setAvailable(res.data.available);
      } catch (err) {
        setAvailable(false);
      } finally {
        setChecking(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [form.username, user?.username]);

  // Profile image
  const cropImageToSquare = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size,
        );
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Crop failed"));
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };

      img.onerror = reject;
    });
  };

  useEffect(() => {
    return () => {
      if (avatarImage) URL.revokeObjectURL(avatarImage as any);
    };
  }, [avatarImage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!available) return;

    try {
      const res = await updateUser({
        username: form.username,
        fullname: form.name,
        bio: form.bio,
        image: avatarImage,
      });

      if (res.data.error) {
        notifyError(res.data.error);
        return;
      }

      const updated = res.data.data;
      dispatch(editUser(updated));

      setUser((prev) => (prev ? { ...prev, ...updated } : updated));
      setEditDialogOpen(false);
      notifySuccess("Profile updated!");
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.error) {
        notifyError(error.response.data.error);
      } else {
        notifyError("Failed to update profile.");
      }
    }
  };

  const requirements =
    checking ||
    !available ||
    !form.username ||
    !form.name ||
    form.username.length < 3 ||
    form.name.length < 6;

  return (
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileRef}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const cropped = await cropImageToSquare(file);
                setAvatarImage(cropped);
              }}
            />
            <DialogTitle>Edit profile</DialogTitle>
            <div className="relative w-full py-3">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqYO0HBlSwjaclJpc1omQSTgeaTV9sZi9aFw&s"
                alt="Banner"
                className="rounded-md h-32 w-full object-cover"
              />
              <div className="absolute left-5 -bottom-12">
                <div className="relative w-24 h-24 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-700">
                  <img
                    src={
                      avatarImage
                        ? URL.createObjectURL(avatarImage)
                        : user?.photo_profile
                          ? user.photo_profile
                          : "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg"
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                  <span
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-7 right-7 p-1 bg-gray-800 rounded-full cursor-pointer"
                  >
                    <ImagePlus className="w-5 h-5 text-white" />
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <DialogDescription className="mb-5 mt-16">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <fieldset className="border border-gray-500 rounded-md px-3 flex items-center">
                  <legend className="px-1 text-sm text-gray-200">Name</legend>
                  <textarea
                    spellCheck={false}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full resize-none border-none focus:outline-none h-8"
                  />
                </fieldset>
              </div>

              <div className="grid gap-3 relative">
                <fieldset className="border border-gray-500 rounded-md px-3 flex items-center">
                  <legend className="px-1 text-sm text-gray-200">
                    Username
                  </legend>
                  <textarea
                    spellCheck={false}
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    required
                    className="w-full resize-none border-none focus:outline-none h-8"
                  />
                </fieldset>
                {form.username !== user?.username &&
                  form.username.length >= 3 && (
                    <span
                      className={`text-sm absolute top-13 right-3 ${
                        available ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {available
                        ? "Username available"
                        : "Username unavailable"}
                    </span>
                  )}
              </div>

              <div className="grid gap-3">
                <fieldset className="border border-gray-500 rounded-md px-3 flex items-center">
                  <legend className="px-1 text-sm text-gray-200">Bio</legend>
                  <textarea
                    spellCheck={false}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    required
                    className="w-full resize-none border-none focus:outline-none h-24"
                  />
                </fieldset>
              </div>
            </div>
          </DialogDescription>

          <hr />
          <DialogFooter className="mt-5 px-5">
            <Button
              type="submit"
              disabled={requirements}
              className={`bg-green-500 text-lg rounded-2xl text-white hover:text-black ${
                requirements ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
