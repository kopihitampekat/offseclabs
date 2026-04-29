"use client";

import { useFormStatus } from "react-dom";

type SubmitFormButtonProps = {
  children: React.ReactNode;
  pendingLabel: string;
  className: string;
  disabled?: boolean;
};

export function SubmitFormButton({
  children,
  pendingLabel,
  className,
  disabled = false,
}: SubmitFormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={className}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
