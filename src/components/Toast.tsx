"use client";

interface ToastProps {
  message: string;
  show: boolean;
}

export default function Toast({ message, show }: ToastProps) {
  if (!show) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-toast-in rounded-lg bg-zinc-900 px-6 py-3 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
    >
      {message}
    </div>
  );
}
