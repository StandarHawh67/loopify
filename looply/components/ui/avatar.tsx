import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

type AvatarProps = {
  src?: string | null;
  alt: string;
  name: string;
  className?: string;
};

export function Avatar({ src, alt, name, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-accent/40 via-[#5a7fff]/40 to-coral/40 text-sm font-semibold text-white",
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes="64px" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
