interface ImagesProps {
  images: string[];
}

export default function Images({ images }: ImagesProps) {
  const length = images.length;

  return (
    <div className="grid gap-1 w-full p-2">
      {length === 1 && (
        <div className="grid grid-cols-1 h-120 w-120 rounded-md overflow-hidden">
          {images.map((img, i) => (
            <img key={i} src={img} className="h-full w-full object-cover" />
          ))}
        </div>
      )}

      {length === 2 && (
        <div className="grid grid-cols-2 gap-1 h-120 w-120 rounded-md overflow-hidden">
          {images.map((img, i) => (
            <img key={i} src={img} className="h-full w-full object-cover" />
          ))}
        </div>
      )}

      {length === 3 && (
        <div className="grid grid-cols-2 gap-1 h-120 w-120 rounded-md overflow-hidden">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              className={`h-full w-full object-cover ${i === 2 ? "col-span-2" : ""}`}
            />
          ))}
        </div>
      )}

      {length === 4 && (
        <div className="grid grid-cols-2 gap-1 h-120 w-120 rounded-md overflow-hidden">
          {images.map((img, i) => (
            <img key={i} src={img} className="h-full w-full object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
