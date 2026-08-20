import Image from "next/image";

// A player headshot from the local /players assets, cropped to a rounded card.
// Images are downloaded at build time (see scripts/fetch-players.mts) so they load
// from 'self' under the strict CSP.
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
      <Image src={src} alt={name} fill sizes="(max-width: 640px) 33vw, 160px" className="object-cover object-top" />
    </span>
  );
}
