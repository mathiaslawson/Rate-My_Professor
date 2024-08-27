import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "any-Klaus",
  description: "Built by devs with tenacity",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
       <html lang="en" className={`${GeistSans.variable}`}>
      <body>
          <TRPCReactProvider>
            <div className="flex justify-between h-[100svh]">
                     {children}
              <div className="blob-cont">
                
    <div className="yellow blob"></div>
    <div className="red blob"></div>
    <div className="green blob"></div>
  </div>
          </div>
          </TRPCReactProvider>
      </body>
    </html>
  </ClerkProvider>
   
  );
}
