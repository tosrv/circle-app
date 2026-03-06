import ThreadDialog from "@/components/thread/ThreadDialog";
import { useThread } from "@/hooks/useThread";
import { createContext, useContext, useState, type ReactNode } from "react";

interface ThreadDialogContextType {
  openThreadDialog: () => void;
  closeThreadDialog: () => void;
  setThreadContent: (content: string) => void;
  addImages: (files: File[]) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
  content: string;
}

const ThreadDialogContext = createContext<ThreadDialogContextType | undefined>(
  undefined,
);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const { createThread } = useThread();

  const openThreadDialog = () => setOpen(true);
  const closeThreadDialog = () => setOpen(false);

  const addImages = (files: File[]) => setImages((prev) => [...prev, ...files]);
  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));
  const clearImages = () => setImages([]);

  const newThread = async (content: string) => {
    await createThread({ content, images });
    setOpen(false);
    clearImages();
    setContent("");
  };

  return (
    <ThreadDialogContext.Provider
      value={{
        openThreadDialog,
        closeThreadDialog,
        setThreadContent: setContent,
        addImages,
        removeImage,
        clearImages,
        content,
      }}
    >
      {children}

      <ThreadDialog
        open={open}
        onOpenChange={setOpen}
        content={content}
        setContent={setContent}
        images={images}
        onImageSelect={addImages}
        onRemoveImage={removeImage}
        clearImage={clearImages}
        newThread={newThread}
      />
    </ThreadDialogContext.Provider>
  );
}

export function useThreadDialog() {
  const context = useContext(ThreadDialogContext);
  if (!context)
    throw new Error("useThreadDialog must be used within ThreadProvider");
  return context;
}
