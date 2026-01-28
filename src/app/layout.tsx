// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideNavigation from "@/app/common/components/SideNavigation";
import { Providers } from "./providers";
import { TokenStyles } from "@/app/common/tokens/TokenStyles";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "LivCalc",
    description: "Simple Living Calculator",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased ${TokenStyles.common.background.base}`}
            >
                <Providers>
                    <div className="flex">
                        <SideNavigation/>
                        <main className="w-full p-4 pb-24 md:pb-4">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}