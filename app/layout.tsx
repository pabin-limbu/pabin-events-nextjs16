import type {Metadata} from "next";
import {Geist, Geist_Mono, Schibsted_Grotesk, Martian_Mono} from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import NavBar from "@/components/NavBar";

const schibstedGrotesk = Schibsted_Grotesk({
    variable: "--font-schibsted_grotesk",
    subsets: ["latin"],
});

const geistMono = Martian_Mono({
    variable: "--font-martian-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Event",
    description: "Event booking and newsletter",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${schibstedGrotesk.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
        <NavBar/>
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">


            <LightRays raysOrigin={'top-center'} raysColor={'#5dfeca'} raysSpeed={1.5} lightSpread={0.8} rayLength={1.2}
                       followMouse={true} mouseInfluence={0.1} noiseAmount={0.1} distortion={0.05}
                       className={'custom-rays'}>
            </LightRays>
        </div>
        {children}
        </body>
        </html>
    );
}
