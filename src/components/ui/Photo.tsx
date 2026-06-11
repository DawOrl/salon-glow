import Image from "next/image";
import { imageMeta } from "@/lib/imageMeta";

/**
 * Cienka nakładka na next/image dla zdjęć z /public.
 * Domyślnie `fill` (rodzic musi być position:relative z określoną wysokością/aspektem)
 * i blur-up z wygenerowanego blurDataURL (zob. scripts/gen-placeholders.mjs).
 */
export function Photo({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  className = "object-cover",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const meta = imageMeta[src];
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={meta ? "blur" : "empty"}
      blurDataURL={meta?.blurDataURL}
      className={className}
    />
  );
}
