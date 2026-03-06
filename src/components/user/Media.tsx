import type { ThreadsProps } from "@/types/props";

export default function Media({ threads }: ThreadsProps) {
  const images = threads.flatMap((t) => t.images ?? []);

  return (
    <div className="p-1">
      <div className="grid grid-cols-3 gap-1">
        {images.map((image, i) => (
          <div key={i} className="aspect-square overflow-hidden">
            <img
              src={image}
              alt="media"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
