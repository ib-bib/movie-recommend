import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { auth } from "~/server/auth";
import { TopNav } from '~/app/_components/top_nav';

export const metadata: Metadata = {
  title: "Fusion",
  description: "Movie Recommendation System",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="overflow-hidden bg-gradient-to-b min-h-screen flex flex-col from-[#002088] via-[#001f50] to-[#000f29] text-neutral-100">
        <TopNav signedIn={session?.user ? true : false} />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
