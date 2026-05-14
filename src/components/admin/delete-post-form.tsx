"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ConfirmDialog } from "./confirm-dialog";

type DeletePostFormProps = {
  slug: string;
  title: string;
  disabled?: boolean;
  deleteAction: (formData: FormData) => Promise<void>;
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

export function DeletePostForm({
  slug,
  title,
  disabled,
  deleteAction,
}: DeletePostFormProps) {
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
            const form = document.getElementById(
              `delete-form-${slug}`
            ) as HTMLFormElement;
            if (form) form.requestSubmit();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <form id={`delete-form-${slug}`} action={deleteAction} className="hidden">
        <input type="hidden" name="slug" value={slug} />
        <SubmitButton disabled={disabled} />
      </form>
    </>
  );
}
