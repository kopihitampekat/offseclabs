import { cn } from "@/v2/lib/utils";

type PlatformTagProps = {
  platform: "htb" | "thm" | "pg" | "custom";
};

const labels = {
  htb: "Hack The Box",
  thm: "TryHackMe",
  pg: "Proving Grounds",
  custom: "Custom",
};

export function PlatformTag({ platform }: PlatformTagProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-md border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-400"
      )}
    >
      {labels[platform]}
    </span>
  );
}
