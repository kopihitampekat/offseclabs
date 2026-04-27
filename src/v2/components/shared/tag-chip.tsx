export function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-0.5 text-xs text-stone-400">
      {children}
    </span>
  );
}
