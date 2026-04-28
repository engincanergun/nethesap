import Image from "next/image";
import Link from "next/link";

export function SiteHeader({
  right,
}: {
  right?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link href="/" aria-label="Ana sayfa" className="flex items-center">
        <Image
          src="/logo.png"
          alt="NetHesap"
          width={1000}
          height={176}
          priority
          sizes="(min-width: 640px) 220px, 180px"
          className="h-10 w-auto object-contain"
        />
      </Link>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </header>
  );
}

