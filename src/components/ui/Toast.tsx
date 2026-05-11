"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1a1a1a",
          color: "#e5e5e5",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          fontSize: "14px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "#1a1a1a",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#1a1a1a",
          },
        },
      }}
    />
  );
}
