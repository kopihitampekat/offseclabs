"use client";

import { useState } from "react";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-stone-100">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-stone-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-stone-300 transition hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-400/20"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
