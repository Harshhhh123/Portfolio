import type { Metadata } from "next";
import { Public_Sans, Roboto, JetBrains_Mono, Anton } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "harsh-goilkar :: cloud console",
  description:
    "Harsh Goilkar -- Cloud/DevOps Engineer & Full-Stack Developer. Portfolio disguised as a cloud provider console.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-provider="aws"
      className={`${publicSans.variable} ${roboto.variable} ${jbMono.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
