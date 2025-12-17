import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "private_chat | Create Room",
  description:
    "A private chat application to create secure self destructing chat rooms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body className={`${jetbrainsMono.className} relative antialiased`}>
        <Providers>
          <FlickeringGrid
            className="fixed top-0 left-0 right-0 bottom-0 -z-10 size-full object-contain"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.4}
            flickerChance={0.15}
          />
          <Toaster
            position="top-center"
            swipeDirections={["top"]}
            theme="dark"
            expand={false}
            toastOptions={{
              style: {
                backgroundColor: "rgba(23, 23, 23, 0.9)",
                color: "#FFFFFF",
                borderRadius: "0px",
              },
            }}
          />
         
          {children}
        </Providers>
      </body>
    </html>
  );
}
