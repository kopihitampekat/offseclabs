"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

type DeleteButtonProps = {
  title: string;
  disabled?: boolean;
};

export function DeleteButton({ title, disabled }: DeleteButtonProps) {
  const { pending } = useFormStatus();
  const [confirmStep, setConfirmStep] = useState(false);

  if (pending) {
    return (
      <button
        disabled
        type="submit"
        className="rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs text-rose-200 opacity-50"
      >
        Deleting...
      </button>
    );
  }

  if (!confirmStep) {
    return (
      <button
        type="button"
        onClick={() => setConfirmStep(true)}
        disabled={disabled}
        className="rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs text-rose-200 transition hover:bg-rose-400/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={disabled}
      className="rounded-lg border border-rose-400 bg-rose-400/20 px-3 py-1.5 text-xs font-medium text-rose-100 transition hover:bg-rose-400/30"
    >
      Click again to confirm
    </button>
  );
}
