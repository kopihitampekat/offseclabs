"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

type ToastContextValue = {
  addToast: (message: string, type?: Toast["type"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let nextId = 0;

  const addToast = useCallback(
    (message: string, type: Toast["type"] = "info") => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${
              toast.type === "success"
                ? "border-lime-300/20 bg-lime-300/10 text-lime-100"
                : toast.type === "error"
                  ? "border-rose-400/20 bg-rose-400/10 text-rose-100"
                  : "border-white/10 bg-white/5 text-stone-200"
            }`}
            style={{ animation: "toast-in 0.3s ease-out" }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
