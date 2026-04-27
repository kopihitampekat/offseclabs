"use client";

import { AnimatedCounter } from "@/v2/components/shared/animated-counter";

type StatsCardProps = {
  label: string;
  value: number;
  color?: string;
};

export function StatsCard({ label, value, color = "text-stone-100" }: StatsCardProps) {
  return (
    <div className="card p-5">
      <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-semibold ${color}`}>
        <AnimatedCounter value={value} />
      </p>
    </div>
  );
}
