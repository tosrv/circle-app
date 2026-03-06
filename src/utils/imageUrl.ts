export function toImageUrl(images: string[]): string[] {
  if (!images || images.length === 0) return [];

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) throw new Error("BASE_URL is not defined");

  return images.map((image) => `${baseUrl}/${image}`);
}

export function singleImageUrl(image: string): string {
  if (!image) return "";
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) throw new Error("BASE_URL is not defined");
  return `${baseUrl}/${image}`;
}