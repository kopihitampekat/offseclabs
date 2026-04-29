"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ConfirmDialog } from "@/v2/components/admin/confirm-dialog";

type DeletePostButtonProps = {
  slug: string;
  title: string;
  disabled?: boolean;
  action: (formData: FormData) => void;
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs text-rose-200 transition hover:bg-rose-400/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export function DeletePostButton({
  slug,
  title,
  disabled,
  action,
}: DeletePostButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={disabled}
        className="rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs text-rose-200 transition hover:bg-rose-400/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete
      </button>

      {showConfirm && (
        <ConfirmDialog
          title="Delete post?"
          message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => {
            const form = document.createElement("form");
            form.action = action.toString();
            form.method = "post";
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "slug";
            input.value = slug;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
            form.remove();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
