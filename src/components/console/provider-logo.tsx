"use client";

import { useState } from "react";

/* Tries the real logo image first (drop files at public/logos/aws.png
   and public/logos/gcp.png). Falls back to inline SVG marks until
   the images exist. */
export function ProviderLogo({ id }: { id: "aws" | "gcp" }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/logos/${id}.png`}
        alt={id === "aws" ? "AWS" : "Google Cloud"}
        className="h-6 w-auto object-contain"
        onError={() => setFailed(true)}
      />
    );
  }

  if (id === "gcp") {
    return (
      <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden>
        <path
          fill="#4285F4"
          d="M24 9.5c4.14 0 7.86 1.42 10.79 4.2l7.44-7.44C37.36 2.34 31.11 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.65 6.72C13.09 13.68 18.09 9.5 24 9.5z"
        />
        <path
          fill="#34A853"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.9-2.26 5.36-4.78 7.02l7.73 6c4.51-4.16 7.09-10.29 7.09-17.49z"
        />
        <path
          fill="#FBBC05"
          d="M11.21 19.94a14.42 14.42 0 0 0 0 8.12l-8.65 6.72A24 24 0 0 1 0 24c0-2.9.7-5.65 1.94-8.06l9.27 8z"
          transform="translate(0 -.72)"
        />
        <path
          fill="#EA4335"
          d="M24 48c6.48 0 11.93-2.13 15.9-5.83l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-5.91 0-10.91-4.18-12.79-9.94l-8.65 6.72C6.51 42.62 14.62 48 24 48z"
        />
      </svg>
    );
  }

  return (
    <svg width="46" height="22" viewBox="0 0 92 34" aria-hidden>
      <text
        x="0"
        y="20"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="20"
        letterSpacing="-0.5"
        fill="#ffffff"
      >
        aws
      </text>
      <path
        d="M1 27c14 8 40 10 65 3.5"
        stroke="#ff9900"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M83 24.5l6.5 3.5-6.5 3"
        stroke="#ff9900"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
