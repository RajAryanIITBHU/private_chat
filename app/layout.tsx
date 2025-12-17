import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

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
      <body className={`${jetbrainsMono.className} antialiased`}>
        <Providers>
          <FlickeringGrid
            className="absolute inset-0 z-0 size-full object-contain"
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
