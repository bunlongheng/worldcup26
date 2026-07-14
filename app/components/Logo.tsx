import Image from "next/image";

// Official FIFA World Cup 26 emblem (black 26 + gold trophy + FIFA).
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/wc26-logo.png"
      alt="FIFA World Cup 26"
      width={250}
      height={386}
      priority
      className={className}
    />
  );
}
