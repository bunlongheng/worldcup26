import Image from "next/image";
import { PlayerSilhouette } from "./PlayerCard";

// A player photo from the local /players assets, cropped to a rounded card.
// Cutout PNGs (transparent Panini-style) sit on the tile bottom; headshot JPGs
// crop to the top. Images are downloaded at build time (scripts/fetch-players.mts)
// so they load from 'self' under the strict CSP. No photo -> jersey silhouette.
export default function PlayerPhoto({
  src,
  name,
  className = "",
}: {
  src: string;
  name: string;
  className?: string;
}) {
  return (
    <span className={`relative block overflow-hidden bg-[var(--bg-2)] ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 640px) 33vw, 160px"
          className={src.endsWith(".png") ? "object-contain object-bottom" : "object-cover object-top"}
        />
      ) : (
        <PlayerSilhouette className="absolute bottom-0 left-1/2 h-[82%] w-auto -translate-x-1/2 text-[var(--border)]" />
      )}
    </span>
  );
}
