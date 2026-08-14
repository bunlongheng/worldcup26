import Image from "next/image";

// Real flag images from flagcdn (no emoji). Code is a2 or gb-eng / gb-sct.
export default function Flag({
  code,
  name,
  className = "",
}: {
  code: string;
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`relative block overflow-hidden rounded-[3px] ring-1 ring-black/30 shadow-sm ${className}`}
    >
      <Image
        src={`https://flagcdn.com/w320/${code}.png`}
        alt={`${name} flag`}
        fill
        sizes="(max-width: 640px) 64px, 128px"
        className="object-cover"
      />
    </span>
  );
}
