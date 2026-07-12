"use client";

import { useState } from "react";

/* Renders /profile.jpg (drop your photo at public/profile.jpg).
   Falls back to "HG" initials until the file exists. */
export function ProfileAvatar({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-full text-xl font-bold ${className ?? ""}`}
      style={{
        background: "var(--bg-hover)",
        color: "var(--accent)",
        border: "1px solid var(--border-strong)",
      }}
    >
      {failed ? (
        "HG"
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/profile.jpg"
          alt="Harsh Goilkar"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
