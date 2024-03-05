"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { cn } from "../../lib/utils";
import SideNavbar from "@/components/SideNavbar";
import { NextUIProvider } from "@nextui-org/react";
import MobileNav from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <NextUIProvider>
        <body
          className={cn(
            "w-full bg-white text-black  ",
            inter.className,
            {
              "debug-screens": process.env.NODE_ENV === "development",
            }
          )}
        >
          <div className="md:flex hidden fixed bg-white h-screen">
            <SideNavbar />
          </div>
          <div className="flex-1 md:flex hidden md:ml-64 p-8">
            
            {children}
            
          </div>

          <div className="flex md:hidden fixed w-full z-10">
          <MobileNav/>

          </div>
          <div className="p-8 md:hidden flex w-full">{children}</div>
        </body>
      </NextUIProvider>
    </html>
  );
}
